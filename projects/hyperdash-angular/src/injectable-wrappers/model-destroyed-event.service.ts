import { Injectable } from '@angular/core';
import { ModelDestroyedEvent } from '@hypertrace/hyperdash';
import { DashboardEventManagerService } from './dashboard-event-manager.service';

/**
 * Injectable implementation of `ModelDestroyedEvent`
 */
@Injectable({ providedIn: 'root' })
export class ModelDestroyedEventService extends ModelDestroyedEvent {
  public constructor(dashboardEventManager: DashboardEventManagerService) {
    super(dashboardEventManager);
  }
}
