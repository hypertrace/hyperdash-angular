import { Directive, OnChanges, ViewContainerRef, input } from '@angular/core';
import { TypedSimpleChanges } from '../util/angular-change-object';
import { DashboardRendererService } from './dashboard-renderer.service';

/**
 * Accepts a model, looking up its renderer, instantiating it and making the model instance available
 * for injection
 */
@Directive({
  selector: '[hdaDashboardModel]',
  standalone: false
})
export class DashboardModelDirective implements OnChanges {
  public constructor(
    private readonly dashboardRendererService: DashboardRendererService,
    private readonly viewContainerRef: ViewContainerRef
  ) {}

  /**
   * The model to render
   */
  public readonly hdaDashboardModel = input<object>();

  public ngOnChanges(changes: TypedSimpleChanges<this>): void {
    if (changes.hdaDashboardModel) {
      this.updateRenderer();
    }
  }

  private updateRenderer(): void {
    const hdaDashboardModel = this.hdaDashboardModel();
    if (hdaDashboardModel) {
      this.dashboardRendererService.renderInViewContainer(hdaDashboardModel, this.viewContainerRef);
    } else {
      this.viewContainerRef.clear();
    }
  }
}
