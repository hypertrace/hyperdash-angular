import { Component, Inject, ViewChild, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ModelApi } from '@hypertrace/hyperdash';
import { ReplaySubject } from 'rxjs';
import { ModelManagerService } from '../injectable-wrappers/model-manager.service';
import { RendererLibraryService } from '../injectable-wrappers/renderer-library.service';
import { getTestScheduler } from '../test/test-utils';
import { RendererApi, RENDERER_API } from './api/renderer-api';
import { DashboardRendererService, RendererDomEvent } from './dashboard-renderer.service';

describe('Dashboard Renderer Service', () => {
  let dashboardRendererService: DashboardRendererService;
  let host: ComponentFixture<HostComponent>;
  let modelManager: ModelManagerService;

  const createModel = (modelProp: string, parent?: object): object => {
    const model = modelManager.create(TestModel, parent);
    model.modelProp = modelProp;

    return model;
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HostComponent, RendererComponent]
    }).compileComponents();

    dashboardRendererService = TestBed.inject(DashboardRendererService);
    modelManager = TestBed.inject(ModelManagerService);
    modelManager.registerModelApiBuilder({
      matches: () => true,
      // eslint-disable-next-line: no-object-literal-type-assertion
      build: () => ({} as ModelApi)
    });
    const rendererLibrary = TestBed.inject(RendererLibraryService);
    rendererLibrary.lookupRenderer = jest.fn().mockReturnValue(RendererComponent);

    host = TestBed.createComponent(HostComponent);
  }));

  test('can render', () => {
    dashboardRendererService.renderInViewContainer(createModel('Renderer'), host.componentInstance.viewContainerRef);

    host.detectChanges();

    expect(host.nativeElement.textContent).toBe('Host > Renderer');
  });

  test('new model replaces old model', () => {
    dashboardRendererService.renderInViewContainer(createModel('First Model'), host.componentInstance.viewContainerRef);

    host.detectChanges();

    dashboardRendererService.renderInViewContainer(
      createModel('Second Model'),
      host.componentInstance.viewContainerRef
    );

    host.detectChanges();

    expect(host.nativeElement.textContent).toBe('Host > Second Model');
  });

  test('allows subscribing to DOM events', () => {
    const model = createModel('Model');
    const ref = dashboardRendererService.renderInViewContainer(model, host.componentInstance.viewContainerRef);
    host.detectChanges();

    getTestScheduler().run(({ expectObservable }) => {
      const observable = dashboardRendererService.getObservableForRendererDomEvent('click', model);
      // DOM events are hot, we need to capture a replay so we can trigger then test the expectation
      const replay = new ReplaySubject<RendererDomEvent<MouseEvent, object, unknown>>();
      observable.subscribe(replay);

      (host.debugElement.query(By.directive(RendererComponent)).nativeElement as HTMLElement).click();

      expectObservable(replay).toBe('x', {
        x: {
          domEvent: expect.any(MouseEvent),
          model: model,
          componentRef: ref
        }
      });
    });
  });

  test('captures DOM events in child models', () => {
    const parentModel = createModel('Parent');
    const model = createModel('Model', parentModel);
    const ref = dashboardRendererService.renderInViewContainer(model, host.componentInstance.viewContainerRef);
    host.detectChanges();

    getTestScheduler().run(({ expectObservable }) => {
      const observable = dashboardRendererService.getObservableForRendererDomEvent('click', parentModel);
      const replay = new ReplaySubject<RendererDomEvent<MouseEvent, object, unknown>>();
      observable.subscribe(replay);

      (host.debugElement.query(By.directive(RendererComponent)).nativeElement as HTMLElement).click();

      expectObservable(replay).toBe('x', {
        x: {
          domEvent: expect.any(MouseEvent),
          model: model,
          componentRef: ref
        }
      });
    });
  });

  test('adds newly rendered models to existing DOM event subscriptions', () => {
    const model = createModel('Model');
    const observable = dashboardRendererService.getObservableForRendererDomEvent('click', model);
    const ref = dashboardRendererService.renderInViewContainer(model, host.componentInstance.viewContainerRef);
    host.detectChanges();

    getTestScheduler().run(({ expectObservable }) => {
      const replay = new ReplaySubject<RendererDomEvent<MouseEvent, object, unknown>>();
      observable.subscribe(replay);

      (host.debugElement.query(By.directive(RendererComponent)).nativeElement as HTMLElement).click();

      expectObservable(replay).toBe('x', {
        x: {
          domEvent: expect.any(MouseEvent),
          model: model,
          componentRef: ref
        }
      });
    });
  });

  test('completes DOM event observable when a model is destroyed', () => {
    const model = createModel('Model');
    const ref = dashboardRendererService.renderInViewContainer(model, host.componentInstance.viewContainerRef);
    host.detectChanges();

    getTestScheduler().run(({ cold, expectObservable }) => {
      const observable = dashboardRendererService.getObservableForRendererDomEvent('click', model);
      const replay = new ReplaySubject<RendererDomEvent<MouseEvent, object, unknown>>();
      observable.subscribe(replay);

      (host.debugElement.query(By.directive(RendererComponent)).nativeElement as HTMLElement).click();

      cold('--x').subscribe(() => modelManager.destroy(model));
      expectObservable(replay).toBe('x-|', {
        x: {
          domEvent: expect.any(MouseEvent),
          model: model,
          componentRef: ref
        }
      });
    });
  });

  test('unsubscribes DOM event listeners when a renderer is destroyed, but does not complete', () => {
    const model = createModel('Model');
    const ref = dashboardRendererService.renderInViewContainer(model, host.componentInstance.viewContainerRef);
    host.detectChanges();

    getTestScheduler().run(({ expectObservable }) => {
      const observable = dashboardRendererService.getObservableForRendererDomEvent('click', model);
      const replay = new ReplaySubject<RendererDomEvent<MouseEvent, object, unknown>>();
      observable.subscribe(replay);

      const element = host.debugElement.query(By.directive(RendererComponent)).nativeElement as HTMLElement;
      element.click();
      ref.destroy();
      element.click();
      expectObservable(replay).toBe('x', {
        x: {
          domEvent: expect.any(MouseEvent),
          model: model,
          componentRef: ref
        }
      });
    });
  });
});

@Component({
  selector: 'hda-dash-angular-renderer-service-host',
  template: 'Host > <ng-container #container><ng-container>'
})
class HostComponent {
  @ViewChild('container', { read: ViewContainerRef, static: true })
  public viewContainerRef!: ViewContainerRef;
}

class TestModel {
  public modelProp?: string;
}

@Component({
  selector: 'hda-dash-angular-renderer-service-renderer',
  template: '{{ api.model.modelProp }}'
})
class RendererComponent {
  public constructor(@Inject(RENDERER_API) public readonly api: RendererApi<TestModel>) {}
}
