import { Injectable } from '@angular/core';
import { RendererLibrary } from '@hypertrace/hyperdash';
import { LoggerService } from './logger.service';

/**
 * Injectable implementation of `RendererLibrary`
 */
@Injectable({ providedIn: 'root' })
export class RendererLibraryService extends RendererLibrary {
  public constructor(logger: LoggerService) {
    super(logger);
  }
}
