import { Injectable } from '@angular/core';
import { ThemeManager } from '@hypertrace/hyperdash';
import { PredefinedThemeService } from '../configuration/predefined-theme.service';
import { ModelLibraryService } from './model-library.service';
import { ModelManagerService } from './model-manager.service';

/**
 * Injectable implementation of `ThemeManager`
 */
@Injectable({ providedIn: 'root' })
export class ThemeManagerService extends ThemeManager {
  public constructor(
    modelManager: ModelManagerService,
    modelLibrary: ModelLibraryService,
    predefinedThemeService: PredefinedThemeService
  ) {
    super(modelManager, modelLibrary, predefinedThemeService.getLightTheme());
  }
}
