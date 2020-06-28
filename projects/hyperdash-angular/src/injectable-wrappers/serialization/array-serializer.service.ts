import { Injectable } from '@angular/core';
import { ArraySerializer } from '@hypertrace/hyperdash';
import { SerializationManagerService } from './serialization-manager.service';

/**
 * Injectable implementation of `ArraySerializer`
 */
@Injectable({ providedIn: 'root' })
export class ArraySerializerService extends ArraySerializer {
  public constructor(serializationManager: SerializationManagerService) {
    super(serializationManager);
  }
}
