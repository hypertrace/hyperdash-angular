import { Injectable } from '@angular/core';
import { VariableSerializer } from '@hypertrace/hyperdash';
import { VariableManagerService } from '../variable-manager.service';

/**
 * Injectable implementation of `VariableSerializer`
 */
@Injectable({ providedIn: 'root' })
export class VariableSerializerService extends VariableSerializer {
  public constructor(variableManager: VariableManagerService) {
    super(variableManager);
  }
}
