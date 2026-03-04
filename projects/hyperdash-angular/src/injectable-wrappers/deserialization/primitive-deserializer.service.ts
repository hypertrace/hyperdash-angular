import { Injectable } from '@angular/core';
import { PrimitiveDeserializer } from '@hypertrace/hyperdash';

/* v8 ignore next */
/**
 * Injectable implementation of PrimitiveDeserializer
 */
@Injectable({ providedIn: 'root' })
export class PrimitiveDeserializerService extends PrimitiveDeserializer {}
