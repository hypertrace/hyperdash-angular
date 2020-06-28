import { Injectable } from '@angular/core';
import { DefaultModelApiBuilder } from '@hypertrace/hyperdash';
import { DataSourceManagerService } from './data-source-manager.service';
import { DeserializationManagerService } from './deserialization/deserialization-manager.service';
import { LoggerService } from './logger.service';
import { ModelChangedEventService } from './model-changed-event.service';
import { ModelDestroyedEventService } from './model-destroyed-event.service';
import { ModelManagerService } from './model-manager.service';
import { ThemeManagerService } from './theme-manager.service';
import { TimeRangeManagerService } from './time-range-manager.service';
import { VariableManagerService } from './variable-manager.service';

/**
 * Injectable implementation of `DefaultModelApiBuilder`
 */
@Injectable({ providedIn: 'root' })
export class DefaultModelApiBuilderService extends DefaultModelApiBuilder {
  public constructor(
    logger: LoggerService,
    modelManager: ModelManagerService,
    dataSourceManager: DataSourceManagerService,
    modelChangedEvent: ModelChangedEventService,
    modelDestroyedEvent: ModelDestroyedEventService,
    themeManager: ThemeManagerService,
    variableManager: VariableManagerService,
    deserializationManager: DeserializationManagerService,
    timeRangeManager: TimeRangeManagerService
  ) {
    super(
      logger,
      modelManager,
      dataSourceManager,
      modelChangedEvent,
      modelDestroyedEvent,
      themeManager,
      variableManager,
      deserializationManager,
      timeRangeManager
    );
  }
}
