import { Injectable } from '@angular/core';
import { PrimitiveSerializer } from '@hypertrace/hyperdash';

/**
 * Injectable implementation of `PrimitiveSerializer`
 */
@Injectable({ providedIn: 'root' })
export class PrimitiveSerializerService extends PrimitiveSerializer {}
