import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ARRAY_PROPERTY,
  BOOLEAN_PROPERTY,
  LogMessage,
  ModelPropertyTypeRegistrationInformation,
  NUMBER_PROPERTY
} from '@hypertrace/hyperdash';
import { DeserializationManagerService } from '../injectable-wrappers/deserialization/deserialization-manager.service';
import { LoggerService } from '../injectable-wrappers/logger.service';
import { ModelLibraryService } from '../injectable-wrappers/model-library.service';
import { ModelManagerService } from '../injectable-wrappers/model-manager.service';
import { ModelPropertyTypeLibraryService } from '../injectable-wrappers/model-property-type-library.service';
import { ModelPropertyValidatorService } from '../injectable-wrappers/model-property-validator.service';
import { SerializationManagerService } from '../injectable-wrappers/serialization/serialization-manager.service';
import { VariableManagerService } from '../injectable-wrappers/variable-manager.service';
import { MODEL_PROPERTY_TYPES } from '../module/dashboard-core.module';
import { DefaultConfigurationService } from './default-configuration.service';

describe('Default configuration service', () => {
  let defaultConfigurationService: DefaultConfigurationService;
  let logger: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MODEL_PROPERTY_TYPES,
          useValue: [{ type: 'test-property' }, TestPropertyTypeProvider],
          multi: true
        }
      ]
    });

    defaultConfigurationService = TestBed.inject(DefaultConfigurationService);
    logger = TestBed.inject(LoggerService);
    const errorSpy = jest.spyOn(logger, 'error');
    errorSpy.mockImplementation(
      message =>
        // tslint:disable-next-line: no-object-literal-type-assertion
        ({
          throw: () => {
            throw new Error(message);
          }
        } as LogMessage)
    );
    logger.warn = jest.fn();
  });

  test('correctly configures deserialization', () => {
    const deserializationManager = TestBed.inject(DeserializationManagerService);
    const modelLibrary = TestBed.inject(ModelLibraryService);

    TestBed.inject(ModelPropertyValidatorService).setStrictSchema(false);
    const testModel = class ModelClass {
      public constructor(public prop: unknown) {}
    };

    modelLibrary.registerModelClass(testModel, { type: 'test-model' });
    modelLibrary.registerModelProperty(testModel, 'prop', {
      type: BOOLEAN_PROPERTY.type,
      key: 'prop'
    });

    // Should throw until we configure the deserialization
    expect(() => deserializationManager.deserialize({ type: 'test-model', prop: false })).toThrow();

    defaultConfigurationService.configure();
    expect(deserializationManager.deserialize({ type: 'test-model', prop: false })).toEqual(new testModel(false));
    expect(deserializationManager.deserialize({ type: 'test-model', prop: [false] })).toEqual(new testModel([false]));
    expect(deserializationManager.deserialize({ type: 'test-model', prop: { nested: false } })).toEqual(
      new testModel({ nested: false })
    );

    expect(
      deserializationManager.deserialize({
        type: 'test-model',
        prop: {
          type: 'test-model',
          prop: 'two models'
        }
      })
    ).toEqual(new testModel(new testModel('two models')));

    expect(
      deserializationManager.deserialize({
        type: 'test-model',
        prop: {
          nested: {
            type: 'test-model',
            prop: 'object sandwich'
          }
        }
      })
    ).toEqual(new testModel({ nested: new testModel('object sandwich') }));
  });

  test('correctly configures deserialization and setting of variables', () => {
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

    defaultConfigurationService.configure();

    const deserializedModel = deserializationManager.deserialize<object>({
      type: 'test-model',
      // tslint:disable-next-line:no-invalid-template-strings
      prop: '${test}'
    });

    expect(deserializedModel).toEqual(new testModel());

    TestBed.inject(VariableManagerService).set('test', 42, deserializedModel);

    expect(deserializedModel).toEqual(new testModel(42));
  });

  test('should throw if attempting to configure twice', () => {
    defaultConfigurationService.configure();

    expect(() => defaultConfigurationService.configure()).toThrow(
      'Default Configuration Service cannot be configured twice'
    );
  });

  test('correctly configures serialization', () => {
    const serializationManager = TestBed.inject(SerializationManagerService);
    const modelLibrary = TestBed.inject(ModelLibraryService);
    const modelManager = TestBed.inject(ModelManagerService);

    const testModel = class {
      public constructor(public prop?: unknown[]) {}
    };

    modelLibrary.registerModelClass(testModel, { type: 'test-model' });
    modelLibrary.registerModelProperty(testModel, 'prop', {
      type: ARRAY_PROPERTY.type,
      key: 'prop',
      required: false
    });

    defaultConfigurationService.configure();

    const modelObject = modelManager.create(testModel) as Required<typeof testModel.prototype>;
    modelObject.prop = ['string val', 42, {}];
    modelObject.prop.push(modelManager.create(testModel, modelObject));

    expect(serializationManager.serialize(modelObject)).toEqual({
      type: 'test-model',
      prop: [
        'string val',
        42,
        {},
        {
          type: 'test-model'
        }
      ]
    });
  });

  test('registers provided property types', () => {
    const propertyTypeLibrary = TestBed.inject(ModelPropertyTypeLibraryService);
    propertyTypeLibrary.registerPropertyType = jest.fn();
    defaultConfigurationService.configure();
    expect(propertyTypeLibrary.registerPropertyType).toHaveBeenCalledWith({ type: 'test-property' });

    expect(propertyTypeLibrary.registerPropertyType).toHaveBeenCalledWith(expect.any(TestPropertyTypeProvider));
  });
});

@Injectable({
  providedIn: 'root'
})
class TestPropertyTypeProvider implements ModelPropertyTypeRegistrationInformation {
  public readonly type: string = 'test-prop-provider';
}
