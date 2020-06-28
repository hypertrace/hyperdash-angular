import { Injectable } from '@angular/core';
import { ModelManager } from '@hypertrace/hyperdash';
import { LoggerService } from './logger.service';
import { ModelCreatedEventService } from './model-created-event.service';
import { ModelDestroyedEventService } from './model-destroyed-event.service';

/**
 * Injectable implementation of ModelManager
 */
@Injectable({ providedIn: 'root' })
export class ModelManagerService extends ModelManager {
  public constructor(
    logger: LoggerService,
    modelDestroyedEvent: ModelDestroyedEventService,
    modelCreatedEvent: ModelCreatedEventService
  ) {
    super(logger, modelCreatedEvent, modelDestroyedEvent);
  }
}
