import { Injectable } from '@angular/core';
import { TimeRangeChangedEvent } from '@hypertrace/hyperdash';
import { DashboardEventManagerService } from './dashboard-event-manager.service';
import { ModelManagerService } from './model-manager.service';

/**
 * @inheritdoc
 */
@Injectable({ providedIn: 'root' })
export class TimeRangeChangedEventService extends TimeRangeChangedEvent {
  public constructor(dashboardEventManager: DashboardEventManagerService, modelManager: ModelManagerService) {
    super(dashboardEventManager, modelManager);
  }
}
