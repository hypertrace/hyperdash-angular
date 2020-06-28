import { Injectable } from '@angular/core';
import { ObjectDeserializer } from '@hypertrace/hyperdash';
import { DeserializationManagerService } from './deserialization-manager.service';

/* istanbul ignore next */
/**
 * Injectable implementation of ObjectDeserializer
 */
@Injectable({ providedIn: 'root' })
export class ObjectDeserializerService extends ObjectDeserializer {
  public constructor(deserializationManager: DeserializationManagerService) {
    super(deserializationManager);
  }
}
