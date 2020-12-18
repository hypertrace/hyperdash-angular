// tslint:disable:ban-types completed-docs
import { TestBed } from '@angular/core/testing';
import {
  ArrayDeserializer,
  ArraySerializer,
  BOOLEAN_PROPERTY,
  DashboardEventManager,
  DashboardManager,
  DataRefreshEvent,
  DefaultModelApiBuilder,
  DeserializationManager,
  EditorApiFactory,
  EditorLibrary,
  Logger,
  Model,
  ModelChangedEvent,
  ModelCreatedEvent,
  ModelDeserializer,
  ModelDestroyedEvent,
  ModelEventInstaller,
  ModelLibrary,
  ModelManager,
  ModelProperty,
  ModelPropertyEditor,
  ModelPropertyType,
  ModelPropertyTypeLibrary,
  ModelPropertyValidator,
  ModelSerializer,
  ObjectDeserializer,
  ObjectSerializer,
  PrimitiveDeserializer,
  PrimitiveSerializer,
  Renderer,
  RendererLibrary,
  SerializationManager,
  STRING_PROPERTY,
  ThemeManager,
  TimeRangeChangedEvent,
  TimeRangeManager,
  VariableDeserializer,
  VariableManager,
  VariableSerializer
} from '@hypertrace/hyperdash';
import { ModelLibraryService } from '../injectable-wrappers/model-library.service';
import { DashboardEventManagerService } from './dashboard-event-manager.service';
import { DashboardManagerService } from './dashboard-manager.service';
import { DataRefreshEventService } from './data-refresh-event.service';
import { DataSourceManagerService } from './data-source-manager.service';
import { DefaultModelApiBuilderService } from './default-model-api-builder.service';
import { ArrayDeserializerService } from './deserialization/array-deserializer.service';
import { DeserializationManagerService } from './deserialization/deserialization-manager.service';
import { ModelDeserializerService } from './deserialization/model-deserializer.service';
import { ObjectDeserializerService } from './deserialization/object-deserializer.service';
import { PrimitiveDeserializerService } from './deserialization/primitive-deserializer.service';
import { VariableDeserializerService } from './deserialization/variable-deserializer.service';
import { EditorApiFactoryService } from './editor-api-factory.service';
import { EditorLibraryService } from './editor-library.service';
import { LoggerService } from './logger.service';
import { ModelChangedEventService } from './model-changed-event.service';
import { ModelCreatedEventService } from './model-created-event.service';
import { ModelDestroyedEventService } from './model-destroyed-event.service';
import { ModelEventInstallerService } from './model-event-installer.service';
import { ModelManagerService } from './model-manager.service';
import { ModelPropertyTypeLibraryService } from './model-property-type-library.service';
import { ModelPropertyTypeService } from './model-property-type.service';
import { ModelPropertyValidatorService } from './model-property-validator.service';
import { RendererLibraryService } from './renderer-library.service';
import { ArraySerializerService } from './serialization/array-serializer.service';
import { ModelSerializerService } from './serialization/model-serializer.service';
import { ObjectSerializerService } from './serialization/object-serializer.service';
import { PrimitiveSerializerService } from './serialization/primitive-serializer.service';
import { SerializationManagerService } from './serialization/serialization-manager.service';
import { VariableSerializerService } from './serialization/variable-serializer.service';
import { ThemeManagerService } from './theme-manager.service';
import { TimeRangeChangedEventService } from './time-range-changed-event.service';
import { TimeRangeManagerService } from './time-range-manager.service';
import { VariableManagerService } from './variable-manager.service';

describe('Injectable wrappers', () => {
  test('should correctly register providers', () => {
    expect(TestBed.inject(ModelLibraryService) instanceof ModelLibrary).toBeTruthy();
    expect(TestBed.inject(RendererLibraryService) instanceof RendererLibrary).toBeTruthy();
    expect(TestBed.inject(ModelDeserializerService) instanceof ModelDeserializer).toBeTruthy();
    expect(TestBed.inject(ArrayDeserializerService) instanceof ArrayDeserializer).toBeTruthy();
    expect(TestBed.inject(ObjectDeserializerService) instanceof ObjectDeserializer).toBeTruthy();
    expect(TestBed.inject(PrimitiveDeserializerService) instanceof PrimitiveDeserializer).toBeTruthy();
    expect(TestBed.inject(DeserializationManagerService) instanceof DeserializationManager).toBeTruthy();
    expect(TestBed.inject(ModelManagerService) instanceof ModelManager).toBeTruthy();
    expect(TestBed.inject(DashboardManagerService) instanceof DashboardManager).toBeTruthy();
    expect(TestBed.inject(DataSourceManagerService) instanceof DataSourceManagerService).toBeTruthy();
    expect(TestBed.inject(LoggerService) instanceof Logger).toBeTruthy();
    expect(TestBed.inject(ModelPropertyTypeLibraryService) instanceof ModelPropertyTypeLibrary).toBeTruthy();
    expect(TestBed.inject(VariableManagerService) instanceof VariableManager).toBeTruthy();
    expect(TestBed.inject(VariableDeserializerService) instanceof VariableDeserializer).toBeTruthy();
    expect(TestBed.inject(DashboardEventManagerService) instanceof DashboardEventManager).toBeTruthy();
    expect(TestBed.inject(DefaultModelApiBuilderService) instanceof DefaultModelApiBuilder).toBeTruthy();
    expect(TestBed.inject(ModelCreatedEventService) instanceof ModelCreatedEvent).toBeTruthy();
    expect(TestBed.inject(ModelDestroyedEventService) instanceof ModelDestroyedEvent).toBeTruthy();
    expect(TestBed.inject(ModelPropertyValidatorService) instanceof ModelPropertyValidator).toBeTruthy();
    expect(TestBed.inject(ModelChangedEventService) instanceof ModelChangedEvent).toBeTruthy();
    expect(TestBed.inject(ThemeManagerService) instanceof ThemeManager).toBeTruthy();
    expect(TestBed.inject(ModelEventInstallerService) instanceof ModelEventInstaller).toBeTruthy();
    expect(TestBed.inject(ModelSerializerService) instanceof ModelSerializer).toBeTruthy();
    expect(TestBed.inject(ArraySerializerService) instanceof ArraySerializer).toBeTruthy();
    expect(TestBed.inject(ObjectSerializerService) instanceof ObjectSerializer).toBeTruthy();
    expect(TestBed.inject(PrimitiveSerializerService) instanceof PrimitiveSerializer).toBeTruthy();
    expect(TestBed.inject(SerializationManagerService) instanceof SerializationManager).toBeTruthy();
    expect(TestBed.inject(VariableSerializerService) instanceof VariableSerializer).toBeTruthy();
    expect(TestBed.inject(EditorLibraryService) instanceof EditorLibrary).toBeTruthy();
    expect(TestBed.inject(EditorApiFactoryService) instanceof EditorApiFactory).toBeTruthy();
    expect(TestBed.inject(ModelPropertyTypeService) instanceof ModelPropertyType).toBeTruthy();
    expect(TestBed.inject(DataRefreshEventService) instanceof DataRefreshEvent).toBeTruthy();
    expect(TestBed.inject(TimeRangeChangedEventService) instanceof TimeRangeChangedEvent).toBeTruthy();
    expect(TestBed.inject(TimeRangeManagerService) instanceof TimeRangeManager).toBeTruthy();
  });

  test('support model decorators', () => {
    @Model({ type: 'test-model-decorator' })
    class TestModelDecoratorClass {}

    expect(
      (TestBed.inject(ModelLibraryService) as ModelLibrary).lookupModelMetadata(TestModelDecoratorClass)
    ).toMatchObject({
      type: 'test-model-decorator'
    });

    // Models registered after the service has been initialzied should still work to support lazy loading
    @Model({ type: 'test-late-model-decorator' })
    class TestLateModelDecoratorClass {}

    expect(
      (TestBed.inject(ModelLibraryService) as ModelLibrary).lookupModelMetadata(TestLateModelDecoratorClass)
    ).toMatchObject({
      type: 'test-late-model-decorator'
    });
  });

  test('supports renderer decorators', () => {
    const modelClass = class {};

    @Renderer({ modelClass: modelClass })
    class TestRendererDecoratorClass {}

    expect((TestBed.inject(RendererLibraryService) as RendererLibrary).lookupRenderer(modelClass)).toBe(
      TestRendererDecoratorClass
    );

    // Renders registered after the service has been initialzied should still work to support lazy loading
    const secondModelClass = class {};

    @Renderer({ modelClass: secondModelClass })
    class TestSecondRendererDecoratorClass {}

    expect((TestBed.inject(RendererLibraryService) as RendererLibrary).lookupRenderer(secondModelClass)).toBe(
      TestSecondRendererDecoratorClass
    );
  });

  test('supports editor decorators', () => {
    @ModelPropertyEditor({ propertyType: STRING_PROPERTY.type })
    class TestEditorClass {}

    @Model({
      type: 'test-model',
      displayName: 'Test Model'
    })
    class TestModelClass {
      @ModelProperty({
        type: STRING_PROPERTY.type,
        key: 'string-key',
        displayName: 'String property'
      })
      public stringProp?: string;

      @ModelProperty({
        type: BOOLEAN_PROPERTY.type,
        key: 'boolean-key',
        displayName: 'Boolean property'
      })
      public booleanProp?: boolean;
    }

    expect((TestBed.inject(EditorLibraryService) as EditorLibrary).getEditorData(TestModelClass)).toMatchObject({
      title: 'Test Model',
      subeditors: [
        {
          title: 'String property',
          editor: TestEditorClass
        }
      ]
    });

    @ModelPropertyEditor({ propertyType: BOOLEAN_PROPERTY.type })
    class LateTestEditorClass {}

    expect((TestBed.inject(EditorLibraryService) as EditorLibrary).getEditorData(TestModelClass)).toMatchObject({
      title: 'Test Model',
      subeditors: [
        {
          title: 'String property',
          editor: TestEditorClass,
          validator: expect.any(Function)
        },
        {
          title: 'Boolean property',
          editor: LateTestEditorClass,
          validator: expect.any(Function)
        }
      ]
    });
  });
});
