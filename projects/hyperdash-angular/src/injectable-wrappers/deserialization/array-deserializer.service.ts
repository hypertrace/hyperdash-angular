import { Injectable } from '@angular/core';
import { ArrayDeserializer } from '@hypertrace/hyperdash';
import { DeserializationManagerService } from './deserialization-manager.service';

/* istanbul ignore next */
/**
 * Injectable implementation of ArrayDeserializer
 */
@Injectable({ providedIn: 'root' })
export class ArrayDeserializerService extends ArrayDeserializer {
  public constructor(deserializationManager: DeserializationManagerService) {
    super(deserializationManager);
  }
}
