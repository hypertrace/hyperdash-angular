import { Injectable } from '@angular/core';
import { ModelDeserializer } from '@hypertrace/hyperdash';
import { DataSourceManagerService } from '../data-source-manager.service';
import { LoggerService } from '../logger.service';
import { ModelLibraryService } from '../model-library.service';
import { ModelManagerService } from '../model-manager.service';
import { ModelPropertyTypeLibraryService } from '../model-property-type-library.service';
import { ModelPropertyValidatorService } from '../model-property-validator.service';
import { ThemeManagerService } from '../theme-manager.service';
import { VariableManagerService } from '../variable-manager.service';
import { DeserializationManagerService } from './deserialization-manager.service';

/**
 * Injectable implementation of ModelDeserializer
 */
@Injectable({ providedIn: 'root' })
export class ModelDeserializerService extends ModelDeserializer {
  public constructor(
    deserializationManager: DeserializationManagerService,
    modelLibrary: ModelLibraryService,
    modelManager: ModelManagerService,
    modelPropertyValidator: ModelPropertyValidatorService,
    logger: LoggerService,
    dataSourceManager: DataSourceManagerService,
    variableManager: VariableManagerService,
    themeManager: ThemeManagerService,
    modelPropertyTypeLibrary: ModelPropertyTypeLibraryService
  ) {
    super(
      deserializationManager,
      modelLibrary,
      modelManager,
      modelPropertyValidator,
      logger,
      dataSourceManager,
      variableManager,
      themeManager,
      modelPropertyTypeLibrary
    );
  }
}
