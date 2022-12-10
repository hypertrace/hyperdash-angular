import { Injectable, Injector, type Type } from '@angular/core';
import { type DashboardEventKey, ModelEventInstaller } from '@hypertrace/hyperdash';
import { DashboardEventManagerService } from './dashboard-event-manager.service';
import { LoggerService } from './logger.service';
import { ModelDestroyedEventService } from './model-destroyed-event.service';

/**
 * Injectable implementation of `ModelEventInstaller`
 */
@Injectable({ providedIn: 'root' })
export class ModelEventInstallerService extends ModelEventInstaller {
  public constructor(
    dashboardEventManager: DashboardEventManagerService,
    modelDestroyedEvent: ModelDestroyedEventService,
    logger: LoggerService,
    private readonly injector: Injector
  ) {
    super(dashboardEventManager, modelDestroyedEvent, logger);
  }

  protected resolveEventKey(providedKey: DashboardEventKey): DashboardEventKey {
    return this.injector.get<DashboardEventKey>(
      providedKey as Type<DashboardEventKey>,
      super.resolveEventKey(providedKey)
    );
  }
}
