import { Injectable } from '@angular/core';
import { DashboardEventManager } from '@hypertrace/hyperdash';
/**
 * Injectable implementation of `DashboardEventManager`
 */
@Injectable({ providedIn: 'root' })
export class DashboardEventManagerService extends DashboardEventManager {
  public constructor() {
    super();
  }
}
