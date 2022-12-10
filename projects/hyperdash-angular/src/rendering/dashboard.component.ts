import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  type OnChanges,
  type OnDestroy,
  Output
} from '@angular/core';
import { type Dashboard, ModelJson } from '@hypertrace/hyperdash';
import { DashboardManagerService } from '../injectable-wrappers/dashboard-manager.service';
import { ModelChangedEventService } from '../injectable-wrappers/model-changed-event.service';
import { type TypedSimpleChanges } from '../util/angular-change-object';
import { DashboardRendererService } from './dashboard-renderer.service';

/**
 * Deserializes and renders the provided JSON object as a dashboard
 */
@Component({
  selector: 'hda-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ' <ng-container [hdaDashboardModel]="dashboardObject?.root"> </ng-container> '
})
export class DashboardComponent<TRoot extends object = object> implements OnChanges, OnDestroy {
  /**
   * The JSON representing the dashboard to render
   */
  @Input()
  public json?: ModelJson;

  /**
   * Emitted with the dashboard api object after it has been instantiated. Will fire
   * each time json is changed.
   */
  @Output()
  public readonly dashboardReady = new EventEmitter<Dashboard<TRoot>>();

  @Output()
  public readonly widgetSelectionChange = new EventEmitter<object>();

  /**
   * The dashboard object produced from the provided JSON
   */
  public dashboardObject?: Dashboard<TRoot>;

  public constructor(
    private readonly dashboardManager: DashboardManagerService,
    private readonly dashboardRenderer: DashboardRendererService,
    private readonly modelChangedEvent: ModelChangedEventService,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  public ngOnChanges(changes: TypedSimpleChanges<this>): void {
    // Changes to json or root data source
    if (changes.json && this.json) {
      this.destroyDashboardIfDefined();
      this.dashboardObject = this.dashboardManager.create(this.json);
      this.addSelectionListenerToWidgets(this.dashboardObject.root);
      this.modelChangedEvent.getObservableForModel(this.dashboardObject.root).subscribe(() => {
        this.changeDetector.markForCheck();
      });
      this.dashboardReady.emit(this.dashboardObject);
    }
  }

  public ngOnDestroy(): void {
    this.destroyDashboardIfDefined();
  }

  private destroyDashboardIfDefined(): void {
    if (this.dashboardObject) {
      this.dashboardObject.destroy();
      this.dashboardObject = undefined; // Normally this will be written over, but create could error
    }
  }

  private addSelectionListenerToWidgets(dashboardRoot: object): void {
    const heardEvents = new WeakSet<Event>();

    this.dashboardRenderer.getObservableForRendererDomEvent('click', dashboardRoot).subscribe(({ model, domEvent }) => {
      if (!heardEvents.has(domEvent)) {
        heardEvents.add(domEvent);
        this.widgetSelectionChange.emit(model);
      }
    });
  }
}
