import { Injectable } from '@angular/core';
import { Theme } from '@hypertrace/hyperdash';

/**
 * An injectable global theme implementation. This should not be used as a model, but
 * is declared as one to support runtime property lookup.
 */
@Injectable({
  providedIn: 'root'
})
export class PredefinedThemeService {
  /**
   * Provides a dark theme
   */
  public getDarkTheme(): Required<Theme> {
    return {
      backgroundColor: 'darkslategray',
      textColor: 'royalblue'
    };
  }

  /**
   * Provides a light theme
   */
  public getLightTheme(): Required<Theme> {
    return {
      backgroundColor: 'white',
      textColor: 'dimgray'
    };
  }
}
