import { ChangeDetectorRef, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Dashboard, ModelJson } from '@hypertrace/hyperdash';
import { EMPTY, Observable } from 'rxjs';
import { DashboardManagerService } from '../injectable-wrappers/dashboard-manager.service';
import { ModelChangedEventService } from '../injectable-wrappers/model-changed-event.service';
import { getTestScheduler, mockDirective } from '../test/test-utils';
import { DashboardModelDirective } from './dashboard-model.directive';
import { DashboardRendererService, RendererDomEvent } from './dashboard-renderer.service';
import { DashboardComponent } from './dashboard.component';

describe('Dashboard Component', () => {
  let dashboardManagerService: DashboardManagerService;
  let host: ComponentFixture<HostComponent>;
  const mockDashDirective = mockDirective<DashboardModelDirective>({
    selector: '[hdaDashboardModel]',
    inputs: ['hdaDashboardModel']
  });
  let mockDashboardRendererService: Partial<DashboardRendererService>;
  let mockRendererDomEventObservable: Observable<RendererDomEvent<Event, object, unknown>>;

  @Component({
    selector: 'hda-host',
    // eslint-disable-next-line: max-inline-declarations
    template: `
      <hda-dashboard
        [json]="json"
        (dashboardReady)="dashboard = $event"
        (widgetSelectionChange)="widgetSelected($event)"
      >
      </hda-dashboard>
    `,
    standalone: false
  })
  class HostComponent {
    public json?: ModelJson;
    public dashboard?: Dashboard;
    public widgetSelected: jest.Mock = jest.fn();
  }

  beforeEach(() => {
    mockRendererDomEventObservable = EMPTY;
    mockDashboardRendererService = {
      getObservableForRendererDomEvent: jest.fn(() => mockRendererDomEventObservable) as jest.Mock
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: DashboardManagerService, useValue: {} },
        { provide: DashboardRendererService, useValue: mockDashboardRendererService }
      ],
      declarations: [HostComponent, DashboardComponent, mockDashDirective]
    }).compileComponents();

    dashboardManagerService = TestBed.inject(DashboardManagerService);
    dashboardManagerService.create = jest.fn().mockImplementation(val => ({ root: val, destroy: jest.fn() }));

    host = TestBed.createComponent(HostComponent);
  });

  test('calls create for new json', () => {
    const firstJson = { type: 'first' };
    host.componentInstance.json = firstJson;
    host.detectChanges();
    expect(dashboardManagerService.create).toHaveBeenLastCalledWith(firstJson);

    const secondJson = { type: 'second' };
    host.componentInstance.json = secondJson;
    host.detectChanges();
    expect(dashboardManagerService.create).toHaveBeenLastCalledWith(secondJson);
  });

  test('destroys old dashboard when new json received', () => {
    const firstJson = { type: 'first' };
    host.componentInstance.json = firstJson;
    host.detectChanges();

    const secondJson = { type: 'second' };
    host.componentInstance.json = secondJson;
    const originalDashboard = host.componentInstance.dashboard!;
    host.detectChanges();
    const newDashboard = host.componentInstance.dashboard!;
    expect(originalDashboard).not.toBe(newDashboard);

    expect(originalDashboard.destroy).toHaveBeenCalled();
  });

  test('handles undefined input', () => {
    host.detectChanges();
    expect(dashboardManagerService.create).not.toHaveBeenCalled();
  });

  test('emits widget selection when widget clicked detected', () => {
    const firstJson = { type: 'first' };
    host.componentInstance.json = firstJson;
    host.detectChanges();

    expect(mockDashboardRendererService.getObservableForRendererDomEvent).toHaveBeenCalledWith('click', firstJson); // Mock deserializer passes json through

    const secondJson = { type: 'second' };
    host.componentInstance.json = secondJson;
    getTestScheduler().run(({ cold, flush }) => {
      const rendererDomEvent: Partial<Event> = { stopPropagation: jest.fn() };
      const rendererEvent: Partial<RendererDomEvent<Event, object, unknown>> = {
        model: secondJson,
        domEvent: rendererDomEvent as Event
      };
      mockRendererDomEventObservable = cold('x', {
        x: rendererEvent as RendererDomEvent<Event, object, unknown>
      });
      host.detectChanges();

      flush();
      expect(host.componentInstance.widgetSelected).toHaveBeenCalledWith(secondJson);
    });
  });

  test('updates change detector when model has changed.', () => {
    // Initialize
    const componentChangeDetector = (
      host.debugElement.query(By.directive(DashboardComponent)).componentInstance as {
        changeDetector: ChangeDetectorRef;
      }
    ).changeDetector;

    componentChangeDetector.markForCheck = jest.fn();

    host.componentInstance.json = { type: 'some-type' };
    host.detectChanges();

    expect(componentChangeDetector.markForCheck).not.toHaveBeenCalled();

    // Trigger a model change event
    const modelChanged = TestBed.inject(ModelChangedEventService);
    modelChanged.publishChange(host.componentInstance.dashboard!.root);

    expect(componentChangeDetector.markForCheck).toHaveBeenCalled();
  });
});
