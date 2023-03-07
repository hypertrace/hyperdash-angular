// tslint:disable:completed-docs
import { Directive, NgModule, Type } from '@angular/core';
// tslint:disable-next-line: no-submodule-imports
import { TestScheduler } from 'rxjs/testing';

export const moduleWithEntryComponents = (...components: Type<unknown>[]): unknown =>
  NgModule({
    declarations: [...components],
    entryComponents: [...components]
  })(class {});

export const mockDirective = <T = unknown>(config: {
  selector: string;
  inputs?: string[];
  outputs?: string[];
}): Type<T> => Directive(config)(class {} as Type<T>);

export const getTestScheduler = () =>
  new TestScheduler((actual: unknown, expected: unknown) => {
    expect(actual).toEqual(expected);
  });
