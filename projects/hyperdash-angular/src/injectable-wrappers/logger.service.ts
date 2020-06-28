import { Injectable } from '@angular/core';
import { Logger } from '@hypertrace/hyperdash';

/**
 * Injectable implementation of `Logger`
 */
@Injectable({ providedIn: 'root' })
export class LoggerService extends Logger {
  public constructor() {
    super();
  }
}
