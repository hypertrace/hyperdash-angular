import { Injectable } from '@angular/core';
import { ModelPropertyType } from '@hypertrace/hyperdash';
import { DeserializationManagerService } from './deserialization/deserialization-manager.service';
import { ModelManagerService } from './model-manager.service';
/**
 * Injectable implementation of `ModelPropertyType`
 */
@Injectable({
  providedIn: 'root'
})
export class ModelPropertyTypeService extends ModelPropertyType {
  public constructor(deserializationManager: DeserializationManagerService, modelManager: ModelManagerService) {
    super(deserializationManager, modelManager);
  }
}
