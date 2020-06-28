import { Injectable } from '@angular/core';
import { EditorApiFactory } from '@hypertrace/hyperdash';
import { DeserializationManagerService } from './deserialization/deserialization-manager.service';
import { ModelChangedEventService } from './model-changed-event.service';
import { ModelManagerService } from './model-manager.service';
import { ModelPropertyTypeLibraryService } from './model-property-type-library.service';
import { SerializationManagerService } from './serialization/serialization-manager.service';

/**
 * Injectable implementation of `EditorApiFactory`
 */
@Injectable({ providedIn: 'root' })
export class EditorApiFactoryService extends EditorApiFactory {
  public constructor(
    modelChangedEvent: ModelChangedEventService,
    serializationManager: SerializationManagerService,
    deserializationManager: DeserializationManagerService,
    modelManager: ModelManagerService,
    modelPropertyTypeLibrary: ModelPropertyTypeLibraryService
  ) {
    super(modelChangedEvent, serializationManager, deserializationManager, modelManager, modelPropertyTypeLibrary);
  }
}
