import { Component, Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EMPTY, Observable } from 'rxjs';
import { type Mock, vi } from 'vitest';
import { ModelChangedEventService } from '../../injectable-wrappers/model-changed-event.service';
import { getTestScheduler } from '../../test/test-utils';
import { DashboardEditorModule } from '../dashboard-editor.module';
import { ModelEditorService } from '../model-editor.service';

describe('Model editor component', () => {
  let mockModelEditorService: Partial<ModelEditorService>;
  let host: ComponentFixture<HostComponent>;
  let mockModelChangedEvent: Partial<ModelChangedEventService>;
  let modelChangedObservable: Observable<object>;

  @Component({
    selector: 'hda-host',
    template: ' <hda-model-editor [model]="model" (modelChange)="modelChanged($event)"> </hda-model-editor> ',
    imports: [DashboardEditorModule],
    schemas: [NO_ERRORS_SCHEMA]
  })
  class HostComponent {
    public model?: object;
    public readonly modelChanged: Mock = vi.fn();
  }

  @Component({
    selector: 'hda-prop-editor',
    template: 'property editor'
  })
  class PropEditorComponent {}

  modelChangedObservable = EMPTY;
  mockModelChangedEvent = {
    getObservableForModel: vi.fn(() => modelChangedObservable)
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ModelEditorService, useValue: {} },
        { provide: ModelChangedEventService, useValue: mockModelChangedEvent }
      ],
      imports: [HostComponent, DashboardEditorModule, PropEditorComponent]
    });

    mockModelEditorService = TestBed.inject(ModelEditorService);
    mockModelEditorService.getRenderData = vi.fn().mockReturnValue([
      {
        component: PropEditorComponent,
        injector: TestBed.inject(Injector)
      }
    ]);

    host = TestBed.createComponent(HostComponent);
    host.changeDetectorRef.markForCheck();
    host.detectChanges();
  });

  test('renders empty if no data provided', () => {
    expect(host.debugElement.nativeElement.textContent.trim()).toBe('');
  });

  test('renders subeditors if model is provided', () => {
    host.componentInstance.model = {};
    host.changeDetectorRef.markForCheck();
    host.detectChanges();

    expect(host.debugElement.query(By.directive(PropEditorComponent)).nativeElement.textContent.trim()).toBe(
      'property editor'
    );
  });

  test('emits a change when model is edited', () => {
    getTestScheduler().run(({ cold, flush }) => {
      const model = {};
      const modelChanges = cold('x', { x: model });
      modelChangedObservable = modelChanges;
      host.componentInstance.model = model;
      host.changeDetectorRef.markForCheck();
      host.detectChanges();
      expect(host.componentInstance.modelChanged).not.toHaveBeenCalled();

      flush();
      expect(host.componentInstance.modelChanged).toHaveBeenCalledWith(model);
    });
  });

  test('unsubscribes to model changes when the input is changed or component is destroyed', () => {
    getTestScheduler().run(({ cold, flush, expectSubscriptions }) => {
      const firstModel = {};
      const secondModel = {};
      const modelChanges = cold<object>('-x');
      modelChangedObservable = modelChanges;
      host.componentInstance.model = firstModel;
      host.changeDetectorRef.markForCheck();
      host.detectChanges();

      flush();
      host.componentInstance.model = secondModel;
      host.changeDetectorRef.markForCheck();
      host.detectChanges();

      host.destroy();
      expectSubscriptions(modelChanges.subscriptions).toBe(['^!', '-(^!)']);
    });
  });
});
