import { Directive, Input, OnChanges, ViewContainerRef } from '@angular/core';
import { TypedSimpleChanges } from '../util/angular-change-object';
import { DashboardRendererService } from './dashboard-renderer.service';

/**
 * Accepts a model, looking up its renderer, instantiating it and making the model instance available
 * for injection
 */
@Directive({
  selector: '[hdaDashboardModel]'
})
export class DashboardModelDirective implements OnChanges {
  public constructor(
    private readonly dashboardRendererService: DashboardRendererService,
    private readonly viewContainerRef: ViewContainerRef
  ) {}

  /**
   * The model to render
   */
  @Input()
  public readonly hdaDashboardModel?: object;

  public ngOnChanges(changes: TypedSimpleChanges<this>): void {
    if (changes.hdaDashboardModel) {
      this.updateRenderer();
    }
  }

  private updateRenderer(): void {
    if (this.hdaDashboardModel) {
      this.dashboardRendererService.renderInViewContainer(this.hdaDashboardModel, this.viewContainerRef);
    } else {
      this.viewContainerRef.clear();
    }
  }
}
