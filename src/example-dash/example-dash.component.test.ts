import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  DashboardCoreModule,
  DashboardEditorModule,
  DefaultConfigurationService,
  LoggerService
} from '@hypertrace/hyperdash-angular';
import { createComponentFactory, type Spectator } from '@ngneat/spectator/jest';
import { ExampleDashComponent } from './example-dash.component';
import { ExampleDashModule } from './example-dash.module';
import { GraphQlDataSourceModule } from './graphql-data-source.module';

describe('example dash component', () => {
  let spectator: Spectator<ExampleDashComponent>;

  const createComponent = createComponentFactory({
    component: ExampleDashComponent,
    imports: [
      ExampleDashModule,
      DashboardCoreModule,
      DashboardEditorModule,
      FormsModule,
      GraphQlDataSourceModule,
      HttpClientTestingModule
    ],
    providers: [{ provide: LoggerService, useValue: { warn: jest.fn() } }]
  });

  beforeEach(waitForAsync(() => {
    spectator = createComponent();
    spectator.inject(DefaultConfigurationService).configure();
  }));

  test('can detect clicks inside the dashboard', () => {
    spectator.component.onClick = jest.fn();
    spectator.detectChanges();

    spectator.query<HTMLElement>('app-example-renderer')?.click();
    spectator.detectChanges();

    expect(spectator.component.onClick).toHaveBeenCalled();
  });

  test('clicking a nested renderer only emits a single event', () => {
    spectator.component.onWidgetSelectionChange = jest.fn();
    spectator.detectChanges();

    spectator.query<HTMLElement>('app-example-renderer')?.click();
    spectator.detectChanges();

    expect(spectator.component.onWidgetSelectionChange).toHaveBeenCalledTimes(1);
  });

  test('can render a dashboard model end to end', fakeAsync(() => {
    spectator.detectChanges();
    spectator.component.dashboard!.setVariable('foo', 'render me!');
    spectator.detectChanges();
    tick(5000);
    spectator.detectChanges();

    expect(spectator.element.textContent).toContain('render me!');

    spectator.component.dashboard!.setVariable('foo', 'new text!');
    spectator.detectChanges();
    tick(5000);
    spectator.detectChanges();

    expect(spectator.element.textContent).not.toContain('render me!');

    expect(spectator.element.textContent).toContain('new text!');

    spectator.component.json = {
      type: 'example-model',
      title: 'wipe it all away'
    };
    spectator.detectChanges();
    tick(5000);
    spectator.detectChanges();

    expect(spectator.element.textContent).not.toContain('new text!');

    expect(spectator.element.textContent).toEqual('wipe it all away');
  }));
});
