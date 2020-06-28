import { Injectable } from '@angular/core';
import { ModelLibrary } from '@hypertrace/hyperdash';
import { LoggerService } from './logger.service';

/**
 * Injectable implementation of `ModelLibrary`
 */
@Injectable({ providedIn: 'root' })
export class ModelLibraryService extends ModelLibrary {
  public constructor(logger: LoggerService) {
    super(logger);
  }
}
