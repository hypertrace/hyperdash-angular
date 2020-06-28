import { Injectable } from '@angular/core';
import { DashboardManager } from '@hypertrace/hyperdash';
import { DataRefreshEventService } from './data-refresh-event.service';
import { DataSourceManagerService } from './data-source-manager.service';
import { DeserializationManagerService } from './deserialization/deserialization-manager.service';
import { ModelManagerService } from './model-manager.service';
import { SerializationManagerService } from './serialization/serialization-manager.service';
import { TimeRangeManagerService } from './time-range-manager.service';
import { VariableManagerService } from './variable-manager.service';

/**
 * Injectable implementation of DashboardManager
 */
@Injectable({ providedIn: 'root' })
export class DashboardManagerService extends DashboardManager {
  public constructor(
    deserializationManager: DeserializationManagerService,
    modelManager: ModelManagerService,
    variableManager: VariableManagerService,
    serializationManager: SerializationManagerService,
    datasourceManager: DataSourceManagerService,
    dataRefreshEvent: DataRefreshEventService,
    timeRangeManager: TimeRangeManagerService
  ) {
    super(
      deserializationManager,
      modelManager,
      variableManager,
      serializationManager,
      datasourceManager,
      dataRefreshEvent,
      timeRangeManager
    );
  }
}
