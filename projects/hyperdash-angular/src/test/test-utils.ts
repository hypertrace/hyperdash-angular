import { Directive, Type } from '@angular/core';
// eslint-disable-next-line: no-submodule-imports
import { TestScheduler } from 'rxjs/testing';

export const mockDirective = <T = unknown>(config: {
  selector: string;
  inputs?: string[];
  outputs?: string[];
  standalone: boolean;
}): Type<T> => Directive(config)(class {} as Type<T>);

export const getTestScheduler = () =>
  new TestScheduler((actual: unknown, expected: unknown) => {
    expect(actual).toEqual(expected);
  });
