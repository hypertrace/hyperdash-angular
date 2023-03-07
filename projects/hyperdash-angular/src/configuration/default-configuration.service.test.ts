import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ARRAY_PROPERTY,
  Deserializer,
  JsonPrimitive,
  LogMessage,
  ModelPropertyTypeRegistrationInformation
} from '@hypertrace/hyperdash';
import { DeserializationManagerService } from '../injectable-wrappers/deserialization/deserialization-manager.service';
import { LoggerService } from '../injectable-wrappers/logger.service';
import { ModelLibraryService } from '../injectable-wrappers/model-library.service';
import { ModelManagerService } from '../injectable-wrappers/model-manager.service';
import { ModelPropertyTypeLibraryService } from '../injectable-wrappers/model-property-type-library.service';
import { SerializationManagerService } from '../injectable-wrappers/serialization/serialization-manager.service';
import { DASHBOARD_DESERIALIZERS, MODEL_PROPERTY_TYPES } from '../module/dashboard-core.module';
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
        },
        {
          provide: DASHBOARD_DESERIALIZERS,
          useValue: [TestDeserializer],
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

    expect(propertyTypeLibrary.registerPropertyType).toHaveBeenCalledTimes(2);
    expect(propertyTypeLibrary.registerPropertyType).toHaveBeenCalledWith({ type: 'test-property' });
    expect(propertyTypeLibrary.registerPropertyType).toHaveBeenCalledWith(expect.any(TestPropertyTypeProvider));

    defaultConfigurationService.configure();
    // Should not be called a third time
    expect(propertyTypeLibrary.registerPropertyType).toHaveBeenCalledTimes(2);
  });

  test('registers provided deserializers', () => {
    const deserializationManager = TestBed.inject(DeserializationManagerService);
    deserializationManager.registerDeserializer = jest.fn();
    defaultConfigurationService.configure();
    expect(deserializationManager.registerDeserializer).toHaveBeenCalledTimes(1);
    expect(deserializationManager.registerDeserializer).toHaveBeenCalledWith(expect.any(TestDeserializer));

    defaultConfigurationService.configure();
    // Should not be called a second time
    expect(deserializationManager.registerDeserializer).toHaveBeenCalledTimes(1);
  });
});

@Injectable({
  providedIn: 'root'
})
class TestPropertyTypeProvider implements ModelPropertyTypeRegistrationInformation {
  public readonly type: string = 'test-prop-provider';
}

@Injectable({
  providedIn: 'root'
})
class TestDeserializer implements Deserializer<string, string> {
  public canDeserialize(json: JsonPrimitive): json is string {
    return typeof json === 'string';
  }
  public deserialize(json: string): string {
    return json.toUpperCase();
  }
}
