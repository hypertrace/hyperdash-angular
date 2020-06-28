import { Injectable } from '@angular/core';
import { DataSourceManager } from '@hypertrace/hyperdash';
import { ModelManagerService } from './model-manager.service';

/**
 * Injectable implementation of `DataSourceManager`
 */
@Injectable({ providedIn: 'root' })
export class DataSourceManagerService extends DataSourceManager {
  public constructor(modelManager: ModelManagerService) {
    super(modelManager);
  }
}
