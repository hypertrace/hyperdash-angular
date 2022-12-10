import { Component, Inject, NgModule } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
// eslint-disable-next-line import/no-extraneous-dependencies
import { By } from '@angular/platform-browser';
import {
  EditorApi,
  Model,
  ModelProperty,
  ModelPropertyEditor,
  type ModelPropertyTypeRegistrationInformation
} from '@hypertrace/hyperdash';
import { DefaultConfigurationService } from '../../configuration/default-configuration.service';
import { ModelDestroyedEventService } from '../../injectable-wrappers/model-destroyed-event.service';
import { DashboardCoreModule } from '../../module/dashboard-core.module';
import { DashboardEditorModule } from '../dashboard-editor.module';
import { EDITOR_API } from '../editor-api-injection-token';

// Large test - testing all machinery, no mocks
describe('Model JSON editor component', () => {
  let host: ComponentFixture<HostComponent>;

  @Component({
    selector: 'hda-host',
    template: ' <hda-model-json-editor [(modelJson)]="modelJson"> </hda-model-json-editor> '
  })
  class HostComponent {
    public modelJson?: object;
  }

  const TEST_PROP_TYPE: ModelPropertyTypeRegistrationInformation = {
    type: 'test-prop-type'
  };

  @Model({
    type: 'test-model'
  })
  class TestModel {
    @ModelProperty({
      type: TEST_PROP_TYPE.type,
      key: 'prop'
    })
    public property: string = 'default';
  }

  @ModelPropertyEditor({ propertyType: TEST_PROP_TYPE.type })
  @Component({
    selector: 'hda-prop-editor',
    template: 'property editor'
  })
  class PropEditorComponent {
    public constructor(@Inject(EDITOR_API) public editorApi: EditorApi<string>) {}
  }

  @NgModule({
    declarations: [PropEditorComponent],
    imports: [
      DashboardCoreModule.with({
        models: [TestModel],
        propertyTypes: [TEST_PROP_TYPE]
      })
    ]
  })
  class TestDashboardModule {}

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HostComponent],
      imports: [DashboardEditorModule, TestDashboardModule]
    });

    TestBed.inject(DefaultConfigurationService).configure();
    host = TestBed.createComponent(HostComponent);
    host.detectChanges();
  });

  test('renders empty if no data provided', () => {
    expect((host.debugElement.nativeElement as HTMLElement).textContent?.trim()).toBe('');
  });

  test('renders subeditors for provided model', () => {
    host.componentInstance.modelJson = {
      type: 'test-model'
    };
    host.detectChanges();

    expect(host.debugElement.query(By.directive(PropEditorComponent))).toBeDefined();
  });

  test('provides access to values in child editor', () => {
    host.componentInstance.modelJson = {
      type: 'test-model'
    };
    host.detectChanges();
    const propEditor = host.debugElement.query(By.directive(PropEditorComponent))
      .componentInstance as PropEditorComponent;
    expect(propEditor.editorApi.value).toBe('default');

    host.componentInstance.modelJson = {
      type: 'test-model',
      prop: 'non default'
    };
    host.detectChanges();
    const updatedPropEditor = host.debugElement.query(By.directive(PropEditorComponent))
      .componentInstance as PropEditorComponent;
    expect(updatedPropEditor.editorApi.value).toBe('non default');
  });

  test('propagates changes from child editor back to host', () => {
    host.componentInstance.modelJson = {
      type: 'test-model'
    };
    host.detectChanges();
    const propEditor = host.debugElement.query(By.directive(PropEditorComponent))
      .componentInstance as PropEditorComponent;
    propEditor.editorApi.valueChange('new value');

    expect(host.componentInstance.modelJson).toEqual({
      type: 'test-model',
      prop: 'new value'
    });
  });

  test('destroys models when a new json object is provided', () => {
    const destroySpy = jest.fn();

    TestBed.inject(ModelDestroyedEventService).getObservable().subscribe(destroySpy);

    host.componentInstance.modelJson = {
      type: 'test-model',
      prop: 'first copy'
    };
    host.detectChanges();
    host.componentInstance.modelJson = {
      type: 'test-model',
      prop: 'second copy'
    };
    host.detectChanges();

    const expectedToDestroy = new TestModel();
    expectedToDestroy.property = 'first copy';

    expect(destroySpy).toHaveBeenCalledTimes(1);
    expect(destroySpy).toHaveBeenCalledWith(expectedToDestroy);
  });
});
