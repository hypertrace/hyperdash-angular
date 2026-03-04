import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { DashboardModelDirective } from './dashboard-model.directive';
import { DashboardRendererService } from './dashboard-renderer.service';

describe('DashboardModelDirective', () => {
  let dashboardRendererService: DashboardRendererService;
  let host: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: DashboardRendererService, useValue: {} }],
      imports: [HostComponent]
    }).compileComponents();

    dashboardRendererService = TestBed.inject(DashboardRendererService);
    dashboardRendererService.renderInViewContainer = vi.fn();

    host = TestBed.createComponent(HostComponent);
  });

  test('passes initial value to renderer service', () => {
    expect(dashboardRendererService.renderInViewContainer).not.toHaveBeenCalled();

    host.componentInstance.model = { test: 'val' };
    host.changeDetectorRef.markForCheck();
    host.detectChanges();

    expect(dashboardRendererService.renderInViewContainer).toHaveBeenCalledTimes(1);

    expect(dashboardRendererService.renderInViewContainer).toHaveBeenCalledWith({ test: 'val' }, expect.anything());
  });

  test('does not call renderer service if model is initially undefined', () => {
    host.componentInstance.model = undefined;
    host.changeDetectorRef.markForCheck();
    host.detectChanges();

    expect(dashboardRendererService.renderInViewContainer).not.toHaveBeenCalled();
  });

  test('passes updates to renderer service', () => {
    host.componentInstance.model = { test: 'val' };
    host.changeDetectorRef.markForCheck();
    host.detectChanges();

    host.componentInstance.model = { test: 'val2' };
    host.changeDetectorRef.markForCheck();
    host.detectChanges();

    expect(dashboardRendererService.renderInViewContainer).toHaveBeenNthCalledWith(
      2,
      { test: 'val2' },
      expect.anything()
    );

    host.componentInstance.model = undefined;
    host.changeDetectorRef.markForCheck();
    host.detectChanges();

    expect(dashboardRendererService.renderInViewContainer).toHaveBeenCalledTimes(2);

    host.componentInstance.model = { test: 'val3' };
    host.changeDetectorRef.markForCheck();
    host.detectChanges();

    expect(dashboardRendererService.renderInViewContainer).toHaveBeenNthCalledWith(
      3,
      { test: 'val3' },
      expect.anything()
    );
  });
});

@Component({
  selector: 'hda-dash-model-directive-host',
  template: '<ng-container [hdaDashboardModel]=model><ng-container>',
  imports: [DashboardModelDirective],
  schemas: [NO_ERRORS_SCHEMA]
})
class HostComponent {
  @Input()
  public model?: object;
}
