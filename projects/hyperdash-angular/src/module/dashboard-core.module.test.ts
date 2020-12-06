import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ARRAY_PROPERTY,
  BOOLEAN_PROPERTY,
  ModelPropertyTypeRegistrationInformation,
  NUMBER_PROPERTY,
  PLAIN_OBJECT_PROPERTY,
  STRING_PROPERTY
} from '@hypertrace/hyperdash';
import { DefaultConfigurationService } from '../configuration/default-configuration.service';
import { DeserializationManagerService } from '../injectable-wrappers/deserialization/deserialization-manager.service';
import { ModelLibraryService } from '../injectable-wrappers/model-library.service';
import { ModelPropertyTypeService } from '../injectable-wrappers/model-property-type.service';
import { ModelPropertyValidatorService } from '../injectable-wrappers/model-property-validator.service';
import { VariableManagerService } from '../injectable-wrappers/variable-manager.service';
import { DashboardCoreModule, MODEL_PROPERTY_TYPES } from './dashboard-core.module';

describe('Dashboard core module', () => {
  const testPropType = {
    type: 'test-prop-type'
  };

  const testPropType2 = {
    type: 'test-prop-type-2'
  };

  @Injectable({
    providedIn: 'root'
  })
  class PropertyTypeProvider implements ModelPropertyTypeRegistrationInformation {
    public readonly type: string = 'injected-test-type';
  }

  test('adds property types to injector', () => {
    TestBed.configureTestingModule({
      imports: [
        DashboardCoreModule.with({
          propertyTypes: [testPropType, testPropType2, PropertyTypeProvider]
        })
      ]
    });

    expect(TestBed.inject(MODEL_PROPERTY_TYPES)).toContainEqual([testPropType, testPropType2, PropertyTypeProvider]);
  });

  test('correctly configures deserialization', () => {
    TestBed.configureTestingModule({
      imports: [DashboardCoreModule]
    });

    const deserializationManager = TestBed.inject(DeserializationManagerService);
    const modelLibrary = TestBed.inject(ModelLibraryService);

    TestBed.inject(ModelPropertyValidatorService).setStrictSchema(false);
    const testModel = class ModelClass {
      public constructor(public prop: unknown) {}
    };

    modelLibrary.registerModelClass(testModel, { type: 'test-model' });
    modelLibrary.registerModelProperty(testModel, 'prop', {
      type: BOOLEAN_PROPERTY.type,
      key: 'boolProp'
    });
    modelLibrary.registerModelProperty(testModel, 'prop', {
      type: ARRAY_PROPERTY.type,
      key: 'arrayProp'
    });
    modelLibrary.registerModelProperty(testModel, 'prop', {
      type: PLAIN_OBJECT_PROPERTY.type,
      key: 'objectProp'
    });
    modelLibrary.registerModelProperty(testModel, 'prop', {
      type: ModelPropertyTypeService.TYPE,
      key: 'modelProp'
    });
    modelLibrary.registerModelProperty(testModel, 'prop', {
      type: STRING_PROPERTY.type,
      key: 'stringProp'
    });

    TestBed.inject(DefaultConfigurationService).configure();
    expect(deserializationManager.deserialize({ type: 'test-model', boolProp: false })).toEqual(new testModel(false));
    expect(deserializationManager.deserialize({ type: 'test-model', arrayProp: [false] })).toEqual(
      new testModel([false])
    );
    expect(deserializationManager.deserialize({ type: 'test-model', objectProp: { nested: false } })).toEqual(
      new testModel({ nested: false })
    );

    expect(
      deserializationManager.deserialize({
        type: 'test-model',
        modelProp: {
          type: 'test-model',
          stringProp: 'two models'
        }
      })
    ).toEqual(new testModel(new testModel('two models')));

    expect(
      deserializationManager.deserialize({
        type: 'test-model',
        objectProp: {
          nested: {
            type: 'test-model',
            stringProp: 'object sandwich'
          }
        }
      })
    ).toEqual(new testModel({ nested: new testModel('object sandwich') }));
  });

  test('correctly configures deserialization for variables', () => {
    TestBed.configureTestingModule({
      imports: [DashboardCoreModule]
    });
    const deserializationManager = TestBed.inject(DeserializationManagerService);
    const modelLibrary = TestBed.inject(ModelLibraryService);

    const testModel = class ModelClass {
      public constructor(public prop?: number) {}
    };

    modelLibrary.registerModelClass(testModel, { type: 'test-model' });
    modelLibrary.registerModelProperty(testModel, 'prop', {
      type: NUMBER_PROPERTY.type,
      key: 'prop',
      required: false
    });

    TestBed.inject(DefaultConfigurationService).configure();

    const deserializedModel = deserializationManager.deserialize<object>({
      type: 'test-model',
      // tslint:disable-next-line:no-invalid-template-strings
      prop: '${test}'
    });

    expect(deserializedModel).toEqual(new testModel());

    TestBed.inject(VariableManagerService).set('test', 42, deserializedModel);

    expect(deserializedModel).toEqual(new testModel(42));
  });
});
