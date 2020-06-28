import { Injectable } from '@angular/core';
import { ModelCreatedEvent } from '@hypertrace/hyperdash';
import { DashboardEventManagerService } from './dashboard-event-manager.service';

/**
 * Injectable implementation of `ModelCreatedEvent`
 */
@Injectable({ providedIn: 'root' })
export class ModelCreatedEventService extends ModelCreatedEvent {
  public constructor(dashboardEventManager: DashboardEventManagerService) {
    super(dashboardEventManager);
  }
}
