import { InjectionToken } from '@angular/core';
import { ModelApi } from '@hypertrace/hyperdash';
import { createServiceFactory } from '@ngneat/spectator/jest';
import { ModelInject, ModelInjectService, MODEL_API } from './model-inject.service';

describe('Model inject service', () => {
  const INJECT_FOO = new InjectionToken<string>('INJECT_FOO');
  const INJECT_BAR = new InjectionToken<string>('INJECT_BAR');
  const INJECT_BAZ = new InjectionToken<string>('INJECT_BAZ');
  const serviceFactory = createServiceFactory({
    service: ModelInjectService,
    providers: [
      {
        provide: INJECT_FOO,
        useValue: 'foo'
      },
      {
        provide: INJECT_BAR,
        useValue: 'bar'
      },
      {
        provide: INJECT_BAZ,
        useValue: 'baz'
      }
    ]
  });

  class ParentModel {
    [key: string]: unknown;

    @ModelInject(MODEL_API)
    public api!: ModelApi;

    @ModelInject(INJECT_FOO)
    public inject1!: string;
  }

  class ChildModel extends ParentModel {
    @ModelInject(INJECT_BAR)
    public inject1!: string;

    @ModelInject(INJECT_BAZ)
    public inject2!: string;
  }

  test('supports injecting into a model', () => {
    const spectator = serviceFactory();
    const model = new ParentModel();
    const apiMock = {};
    spectator.service.decorate(model, apiMock as ModelApi);

    expect(model.api).toBe(apiMock);
    expect(model.inject1).toBe('foo');
  });

  test('injects properties defined in a base class', () => {
    const spectator = serviceFactory();
    const model = new ChildModel();
    const apiMock = {};
    spectator.service.decorate(model, apiMock as ModelApi);

    expect(model.api).toBe(apiMock);
    expect(model.inject1).toBe('bar');
    expect(model.inject2).toBe('baz');
  });
});
