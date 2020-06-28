import { InjectionToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ModelEventMetadataType } from '@hypertrace/hyperdash';
import { Subject } from 'rxjs';
import { DashboardEventManagerService } from './dashboard-event-manager.service';
import { ModelEventInstallerService } from './model-event-installer.service';

describe('Model event installer service', () => {
  // Note - using symbols in DI is broken https://github.com/angular/angular/issues/23170
  const eventKey = {};
  const eventKeyInjectionToken = new InjectionToken<typeof eventKey>('token');

  let modelEventInstallerService: ModelEventInstallerService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: eventKeyInjectionToken, useValue: eventKey }]
    });
    modelEventInstallerService = TestBed.get(ModelEventInstallerService);
  });

  test('should support injecting event keys', () => {
    const dashEventManagerService: DashboardEventManagerService = TestBed.get(DashboardEventManagerService);
    dashEventManagerService.publishEvent = jest.fn();

    class TestModelClass {
      public event$: Subject<string> = new Subject();
      public otherEvent$: Subject<string> = new Subject();
    }

    modelEventInstallerService.registerModelEvent(
      TestModelClass,
      'event$',
      eventKeyInjectionToken,
      ModelEventMetadataType.Publisher
    );
    modelEventInstallerService.registerModelEvent(
      TestModelClass,
      'otherEvent$',
      eventKey,
      ModelEventMetadataType.Publisher
    );

    const model = new TestModelClass();
    modelEventInstallerService.decorate(model);
    model.event$.next('z');
    model.otherEvent$.next('a');

    expect(dashEventManagerService.publishEvent).toHaveBeenCalledTimes(2);
    expect(dashEventManagerService.publishEvent).toHaveBeenCalledWith(eventKey, 'z');
    expect(dashEventManagerService.publishEvent).toHaveBeenCalledWith(eventKey, 'a');
  });
});
