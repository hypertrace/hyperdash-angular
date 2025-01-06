import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DashboardModelDirective } from './dashboard-model.directive';
import { DashboardRendererService } from './dashboard-renderer.service';

describe('DashboardModelDirective', () => {
  let dashboardRendererService: DashboardRendererService;
  let host: ComponentFixture<HostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: DashboardRendererService, useValue: {} }],
      declarations: [HostComponent, DashboardModelDirective]
    }).compileComponents();

    dashboardRendererService = TestBed.inject(DashboardRendererService);
    dashboardRendererService.renderInViewContainer = jest.fn();

    host = TestBed.createComponent(HostComponent);
  }));

  test('passes initial value to renderer service', () => {
    expect(dashboardRendererService.renderInViewContainer).not.toHaveBeenCalled();

    host.componentInstance.model = { test: 'val' };
    host.detectChanges();

    expect(dashboardRendererService.renderInViewContainer).toHaveBeenCalledTimes(1);

    expect(dashboardRendererService.renderInViewContainer).toHaveBeenCalledWith({ test: 'val' }, expect.anything());
  });

  test('does not call renderer service if model is initially undefined', () => {
    host.componentInstance.model = undefined;
    host.detectChanges();

    expect(dashboardRendererService.renderInViewContainer).not.toHaveBeenCalled();
  });

  test('passes updates to renderer service', () => {
    host.componentInstance.model = { test: 'val' };
    host.detectChanges();

    host.componentInstance.model = { test: 'val2' };
    host.detectChanges();

    expect(dashboardRendererService.renderInViewContainer).toHaveBeenNthCalledWith(
      2,
      { test: 'val2' },
      expect.anything()
    );

    host.componentInstance.model = undefined;
    host.detectChanges();

    expect(dashboardRendererService.renderInViewContainer).toHaveBeenCalledTimes(2);

    host.componentInstance.model = { test: 'val3' };
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
  standalone: false
})
class HostComponent {
  @Input()
  public model?: object;
}
