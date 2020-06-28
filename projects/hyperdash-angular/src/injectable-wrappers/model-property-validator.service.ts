import { Injectable } from '@angular/core';
import { ModelPropertyValidator } from '@hypertrace/hyperdash';
import { LoggerService } from './logger.service';
import { ModelPropertyTypeLibraryService } from './model-property-type-library.service';

/**
 * Injectable implementation of `ModelPropertyValidator`
 */
@Injectable({ providedIn: 'root' })
export class ModelPropertyValidatorService extends ModelPropertyValidator {
  public constructor(modelPropertyTypeLibraryService: ModelPropertyTypeLibraryService, logger: LoggerService) {
    super(modelPropertyTypeLibraryService, logger);
  }
}
