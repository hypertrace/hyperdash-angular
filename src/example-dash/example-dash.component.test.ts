import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  DashboardCoreModule,
  DashboardEditorModule,
  DefaultConfigurationService,
  LoggerService
} from '@hypertrace/hyperdash-angular';
import { vi } from 'vitest';
import { ExampleDashComponent } from './example-dash.component';
import { ExampleDashModule } from './example-dash.module';
import { GraphQlDataSourceModule } from './graphql-data-source.module';

describe('example dash component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleDashModule, DashboardCoreModule, DashboardEditorModule, FormsModule, GraphQlDataSourceModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LoggerService, useValue: { warn: vi.fn() } }
      ]
    }).compileComponents();

    TestBed.inject(DefaultConfigurationService).configure();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('can detect clicks inside the dashboard', () => {
    const fixture = TestBed.createComponent(ExampleDashComponent);
    fixture.componentInstance.onClick = vi.fn();
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    fixture.nativeElement.querySelector('app-example-renderer').click();
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(fixture.componentInstance.onClick).toHaveBeenCalled();
  });

  test('clicking a nested renderer only emits a single event', () => {
    const fixture = TestBed.createComponent(ExampleDashComponent);
    fixture.componentInstance.onWidgetSelectionChange = vi.fn();
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    fixture.nativeElement.querySelector('app-example-renderer').click();
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(fixture.componentInstance.onWidgetSelectionChange).toHaveBeenCalledTimes(1);
  });

  test('can render a dashboard model end to end', async () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(ExampleDashComponent);

    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.componentInstance.dashboard!.setVariable('foo', 'render me!');
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(5000);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('render me!');

    fixture.componentInstance.dashboard!.setVariable('foo', 'new text!');
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(5000);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('render me!');

    expect(fixture.nativeElement.textContent).toContain('new text!');

    fixture.componentInstance.json = {
      type: 'example-model',
      title: 'wipe it all away'
    };
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(5000);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('new text!');
    expect(fixture.nativeElement.textContent).toContain('wipe it all away');
  });
});
