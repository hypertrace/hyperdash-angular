import { Injectable } from '@angular/core';
import { TimeRangeManager } from '@hypertrace/hyperdash';
import { ModelManagerService } from './model-manager.service';
import { TimeRangeChangedEventService } from './time-range-changed-event.service';

/**
 * @inheritdoc
 */
@Injectable({ providedIn: 'root' })
export class TimeRangeManagerService extends TimeRangeManager {
  public constructor(modelManager: ModelManagerService, timeRangeChangedEvent: TimeRangeChangedEventService) {
    super(modelManager, timeRangeChangedEvent);
  }
}
