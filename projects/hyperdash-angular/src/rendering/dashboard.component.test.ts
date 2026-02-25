import { ChangeDetectorRef, Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Dashboard, ModelJson } from '@hypertrace/hyperdash';
import { EMPTY, Observable } from 'rxjs';
import { type Mock, vi } from 'vitest';
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
    inputs: ['hdaDashboardModel'],
    standalone: true
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
    standalone: true,
    imports: [DashboardComponent],
    schemas: [NO_ERRORS_SCHEMA]
  })
  class HostComponent {
    public json?: ModelJson;
    public dashboard?: Dashboard;
    public widgetSelected: Mock = vi.fn();
  }

  beforeEach(() => {
    mockRendererDomEventObservable = EMPTY;
    mockDashboardRendererService = {
      getObservableForRendererDomEvent: vi.fn(() => mockRendererDomEventObservable)
    } as unknown as Partial<DashboardRendererService>;

    TestBed.configureTestingModule({
      providers: [
        { provide: DashboardManagerService, useValue: {} },
        { provide: DashboardRendererService, useValue: mockDashboardRendererService }
      ],
      imports: [HostComponent]
    });

    TestBed.overrideComponent(DashboardComponent, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      remove: { imports: [DashboardModelDirective] as any[] },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      add: { imports: [mockDashDirective] as any[] }
    });

    dashboardManagerService = TestBed.inject(DashboardManagerService);
    dashboardManagerService.create = vi.fn().mockImplementation(val => ({ root: val, destroy: vi.fn() }));

    host = TestBed.createComponent(HostComponent);
  });

  test('calls create for new json', () => {
    const firstJson = { type: 'first' };
    host.componentInstance.json = firstJson;
    host.changeDetectorRef.markForCheck();
    host.detectChanges();
    expect(dashboardManagerService.create).toHaveBeenLastCalledWith(firstJson);

    const secondJson = { type: 'second' };
    host.componentInstance.json = secondJson;
    host.changeDetectorRef.markForCheck();
    host.detectChanges();
    expect(dashboardManagerService.create).toHaveBeenLastCalledWith(secondJson);
  });

  test('destroys old dashboard when new json received', () => {
    const firstJson = { type: 'first' };
    host.componentInstance.json = firstJson;
    host.changeDetectorRef.markForCheck();
    host.detectChanges();

    const secondJson = { type: 'second' };
    host.componentInstance.json = secondJson;
    const originalDashboard = host.componentInstance.dashboard!;
    host.changeDetectorRef.markForCheck();
    host.detectChanges();
    const newDashboard = host.componentInstance.dashboard!;
    expect(originalDashboard).not.toBe(newDashboard);

    expect(originalDashboard.destroy).toHaveBeenCalled();
  });

  test('handles undefined input', () => {
    host.changeDetectorRef.markForCheck();
    host.detectChanges();
    expect(dashboardManagerService.create).not.toHaveBeenCalled();
  });

  test('emits widget selection when widget clicked detected', () => {
    const firstJson = { type: 'first' };
    host.componentInstance.json = firstJson;
    host.changeDetectorRef.markForCheck();
    host.detectChanges();

    expect(mockDashboardRendererService.getObservableForRendererDomEvent).toHaveBeenCalledWith('click', firstJson); // Mock deserializer passes json through

    const secondJson = { type: 'second' };
    host.componentInstance.json = secondJson;
    getTestScheduler().run(({ cold, flush }) => {
      const rendererDomEvent: Partial<Event> = { stopPropagation: vi.fn() };
      const rendererEvent: Partial<RendererDomEvent<Event, object, unknown>> = {
        model: secondJson,
        domEvent: rendererDomEvent as Event
      };
      mockRendererDomEventObservable = cold('x', {
        x: rendererEvent as RendererDomEvent<Event, object, unknown>
      });
      host.changeDetectorRef.markForCheck();
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

    componentChangeDetector.markForCheck = vi.fn();

    host.componentInstance.json = { type: 'some-type' };
    host.changeDetectorRef.markForCheck();
    host.detectChanges();

    expect(componentChangeDetector.markForCheck).not.toHaveBeenCalled();

    // Trigger a model change event
    const modelChanged = TestBed.inject(ModelChangedEventService);
    modelChanged.publishChange(host.componentInstance.dashboard!.root);

    expect(componentChangeDetector.markForCheck).toHaveBeenCalled();
  });
});
