import { Injectable } from '@angular/core';
import { EditorLibrary } from '@hypertrace/hyperdash';
import { DataSourceManagerService } from './data-source-manager.service';
import { LoggerService } from './logger.service';
import { ModelLibraryService } from './model-library.service';
import { ModelPropertyTypeLibraryService } from './model-property-type-library.service';
import { RendererLibraryService } from './renderer-library.service';
import { ThemeManagerService } from './theme-manager.service';

/**
 * Injectable implementation of `EditorLibrary`
 */
@Injectable({ providedIn: 'root' })
export class EditorLibraryService extends EditorLibrary {
  public constructor(
    modelLibrary: ModelLibraryService,
    modelPropertyTypeLibrary: ModelPropertyTypeLibraryService,
    logger: LoggerService,
    rendererLibrary: RendererLibraryService,
    themeManager: ThemeManagerService,
    dataSourceManager: DataSourceManagerService
  ) {
    super(modelLibrary, modelPropertyTypeLibrary, logger, rendererLibrary, themeManager, dataSourceManager);
  }
}
