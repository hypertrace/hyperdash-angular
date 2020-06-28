import { Injectable } from '@angular/core';
import { VariableDeserializer } from '@hypertrace/hyperdash';
import { VariableManagerService } from '../variable-manager.service';

/**
 * Injectable implementation of `VariableDeserializer`
 */
@Injectable({ providedIn: 'root' })
export class VariableDeserializerService extends VariableDeserializer {
  public constructor(variableManager: VariableManagerService) {
    super(variableManager);
  }
}
