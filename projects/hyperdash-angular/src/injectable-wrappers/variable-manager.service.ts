import { Injectable } from '@angular/core';
import { VariableManager } from '@hypertrace/hyperdash';
import { LoggerService } from './logger.service';
import { ModelChangedEventService } from './model-changed-event.service';
import { ModelManagerService } from './model-manager.service';

/**
 * Injectable implementation of `VariableManager`
 */
@Injectable({ providedIn: 'root' })
export class VariableManagerService extends VariableManager {
  public constructor(
    logger: LoggerService,
    modelManager: ModelManagerService,
    modelChangedEvent: ModelChangedEventService
  ) {
    super(logger, modelManager, modelChangedEvent);
  }
}
