import { Injectable } from '@angular/core';
import { SerializationManager } from '@hypertrace/hyperdash';
import { LoggerService } from '../logger.service';

/**
 * Injectable implementation of `SerializationManager`
 */
@Injectable({ providedIn: 'root' })
export class SerializationManagerService extends SerializationManager {
  public constructor(logger: LoggerService) {
    super(logger);
  }
}
