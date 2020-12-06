import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  DashboardCoreModule,
  DashboardEditorModule,
  DefaultConfigurationService,
  LoggerService
} from '@hypertrace/hyperdash-angular';
import { ExampleDashComponent } from './example-dash.component';
import { ExampleDashModule } from './example-dash.module';
import { GraphQlDataSourceModule } from './graphql-data-source.module';

describe('example dash component', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ExampleDashComponent],
        imports: [
          ExampleDashModule,
          DashboardCoreModule,
          DashboardEditorModule,
          FormsModule,
          GraphQlDataSourceModule,
          HttpClientTestingModule
        ],
        providers: [{ provide: LoggerService, useValue: { warn: jest.fn() } }]
      }).compileComponents();

      TestBed.inject(DefaultConfigurationService).configure();
    })
  );

  test('can detect clicks inside the dashboard', () => {
    const fixture = TestBed.createComponent(ExampleDashComponent);
    fixture.componentInstance.onClick = jest.fn();
    fixture.detectChanges();

    fixture.nativeElement.querySelector('app-example-renderer').click();
    fixture.detectChanges();

    expect(fixture.componentInstance.onClick).toHaveBeenCalled();
  });

  test('clicking a nested renderer only emits a single event', () => {
    const fixture = TestBed.createComponent(ExampleDashComponent);
    fixture.componentInstance.onWidgetSelectionChange = jest.fn();
    fixture.detectChanges();

    fixture.nativeElement.querySelector('app-example-renderer').click();
    fixture.detectChanges();

    expect(fixture.componentInstance.onWidgetSelectionChange).toHaveBeenCalledTimes(1);
  });

  test('can render a dashboard model end to end', fakeAsync(() => {
    const fixture = TestBed.createComponent(ExampleDashComponent);

    fixture.detectChanges();
    fixture.componentInstance.dashboard!.setVariable('foo', 'render me!');
    fixture.detectChanges();
    tick(5000);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('render me!');

    fixture.componentInstance.dashboard!.setVariable('foo', 'new text!');
    fixture.detectChanges();
    tick(5000);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('render me!');

    expect(fixture.nativeElement.textContent).toContain('new text!');

    fixture.componentInstance.json = {
      type: 'example-model',
      title: 'wipe it all away'
    };
    fixture.detectChanges();
    tick(5000);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('new text!');

    expect(fixture.nativeElement.textContent).toContain('wipe it all away');
  }));
});
