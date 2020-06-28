import { Injectable } from '@angular/core';
import { ModelPropertyTypeLibrary } from '@hypertrace/hyperdash';
import { LoggerService } from './logger.service';

/**
 * Injectable implementation of `ModelPropertyTypeLibrary`
 */
@Injectable({ providedIn: 'root' })
export class ModelPropertyTypeLibraryService extends ModelPropertyTypeLibrary {
  public constructor(logger: LoggerService) {
    super(logger);
  }
}
