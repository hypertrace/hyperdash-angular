import { Injectable } from '@angular/core';
import { BeforeModelDestroyedEvent } from '@hypertrace/hyperdash';
import { DashboardEventManagerService } from './dashboard-event-manager.service';

/**
 * Injectable implementation of `BeforeModelDestroyedEvent`
 */
@Injectable({ providedIn: 'root' })
export class BeforeModelDestroyedEventService extends BeforeModelDestroyedEvent {
  public constructor(dashboardEventManager: DashboardEventManagerService) {
    super(dashboardEventManager);
  }
}
