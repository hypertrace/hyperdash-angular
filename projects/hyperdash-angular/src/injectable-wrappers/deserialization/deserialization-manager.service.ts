import { Injectable } from '@angular/core';
import { DeserializationManager } from '@hypertrace/hyperdash';
import { LoggerService } from '../logger.service';

/**
 * Injectable implementation of DeserializationManager
 */
@Injectable({ providedIn: 'root' })
export class DeserializationManagerService extends DeserializationManager {
  public constructor(logger: LoggerService) {
    super(logger);
  }
}
