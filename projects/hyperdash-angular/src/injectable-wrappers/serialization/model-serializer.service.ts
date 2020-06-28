import { Injectable } from '@angular/core';
import { ModelSerializer } from '@hypertrace/hyperdash';
import { DataSourceManagerService } from '../data-source-manager.service';
import { ModelLibraryService } from '../model-library.service';
import { ModelManagerService } from '../model-manager.service';
import { ModelPropertyTypeLibraryService } from '../model-property-type-library.service';
import { ThemeManagerService } from '../theme-manager.service';
import { SerializationManagerService } from './serialization-manager.service';

/**
 * Injectable implementation of `ModelSerializer`
 */
@Injectable({ providedIn: 'root' })
export class ModelSerializerService extends ModelSerializer {
  public constructor(
    modelManager: ModelManagerService,
    modelLibrary: ModelLibraryService,
    serializationManager: SerializationManagerService,
    dataSourceManager: DataSourceManagerService,
    themeManager: ThemeManagerService,
    modelpropertyTypeLibrary: ModelPropertyTypeLibraryService
  ) {
    super(modelManager, modelLibrary, serializationManager, dataSourceManager, themeManager, modelpropertyTypeLibrary);
  }
}
