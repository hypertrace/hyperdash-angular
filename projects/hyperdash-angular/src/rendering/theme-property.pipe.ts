import { Inject, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModelChangedEventService } from '../injectable-wrappers/model-changed-event.service';
import { ModelManagerService } from '../injectable-wrappers/model-manager.service';
import { ThemeManagerService } from '../injectable-wrappers/theme-manager.service';
import { RendererApi, RENDERER_API } from './api/renderer-api';

/**
 * A pipe supporting looking up a theme property in the DOM
 * based on a property key and the nearest rendered model
 */
@Pipe({
  name: 'themeProp',
  // tslint:disable-next-line: no-pipe-impure Must be impure - result depends on state of model tree
  pure: false
})
export class ThemePropertyPipe implements PipeTransform, OnDestroy {
  private modelChanged: boolean = true;
  private lastKeyRequested: string = '';
  private lastValue: string = '';
  private readonly modelChangedSubscription: Subscription;

  public constructor(
    // tslint:disable-next-line:ban-types TODO - ngc doesn't seem to support `object` here
    @Inject(RENDERER_API) public readonly rendererApi: RendererApi<object>,
    private readonly themeManager: ThemeManagerService,
    modelManager: ModelManagerService,
    modelChangedEvent: ModelChangedEventService
  ) {
    this.modelChangedSubscription = modelChangedEvent
      .getObservableForModel(modelManager.getRoot(rendererApi.model))
      .subscribe(() => (this.modelChanged = true));
  }

  /**
   * Looks up the value of the provided property key. Returns undefined if not found
   */
  public transform(key: string): string {
    if (!this.isDirty(key)) {
      return this.lastValue;
    }
    this.lastKeyRequested = key;
    this.modelChanged = false;
    this.lastValue = this.calculateValue(key);

    return this.lastValue;
  }

  public ngOnDestroy(): void {
    this.modelChangedSubscription.unsubscribe();
  }

  private isDirty(keyRequested: string): boolean {
    return this.modelChanged || this.lastKeyRequested !== keyRequested;
  }

  private calculateValue(keyRequested: string): string {
    // tslint:disable-next-line:strict-boolean-expressions
    return this.themeManager.getThemePropertyForModel(this.rendererApi.model, keyRequested) || '';
  }
}
