import { Injectable } from '@angular/core';
import { DataRefreshEvent } from '@hypertrace/hyperdash';
import { DashboardEventManagerService } from './dashboard-event-manager.service';
import { ModelManagerService } from './model-manager.service';

/**
 * Injectable implementation of `DataRefreshEvent`
 */
@Injectable({ providedIn: 'root' })
export class DataRefreshEventService extends DataRefreshEvent {
  public constructor(dashboardEventManager: DashboardEventManagerService, modelManager: ModelManagerService) {
    super(dashboardEventManager, modelManager);
  }
}
