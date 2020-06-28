import { Injectable } from '@angular/core';
import { ObjectSerializer } from '@hypertrace/hyperdash';
import { SerializationManagerService } from './serialization-manager.service';

/**
 * Injectable implementation of `ObjectSerializer`
 */
@Injectable({ providedIn: 'root' })
export class ObjectSerializerService extends ObjectSerializer {
  public constructor(serializationManager: SerializationManagerService) {
    super(serializationManager);
  }
}
