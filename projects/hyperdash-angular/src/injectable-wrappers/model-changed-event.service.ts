import { Injectable } from '@angular/core';
import { ModelChangedEvent } from '@hypertrace/hyperdash';
import { DashboardEventManagerService } from './dashboard-event-manager.service';
import { ModelManagerService } from './model-manager.service';

/**
 * Injectable implementation of `ModelChangedEvent`
 */
@Injectable({ providedIn: 'root' })
export class ModelChangedEventService extends ModelChangedEvent {
  public constructor(dashboardEventManager: DashboardEventManagerService, modelManager: ModelManagerService) {
    super(dashboardEventManager, modelManager);
  }
}
