import { Inject, Injectable, Injector, Type } from '@angular/core';
import { ModelPropertyTypeRegistrationInformation } from '@hypertrace/hyperdash';
import { flatten, uniq } from 'lodash';
import { DefaultModelApiBuilderService } from '../injectable-wrappers/default-model-api-builder.service';
import { ArrayDeserializerService } from '../injectable-wrappers/deserialization/array-deserializer.service';
import { DeserializationManagerService } from '../injectable-wrappers/deserialization/deserialization-manager.service';
import { ModelDeserializerService } from '../injectable-wrappers/deserialization/model-deserializer.service';
import { ObjectDeserializerService } from '../injectable-wrappers/deserialization/object-deserializer.service';
import { PrimitiveDeserializerService } from '../injectable-wrappers/deserialization/primitive-deserializer.service';
import { VariableDeserializerService } from '../injectable-wrappers/deserialization/variable-deserializer.service';
import { ModelEventInstallerService } from '../injectable-wrappers/model-event-installer.service';
import { ModelManagerService } from '../injectable-wrappers/model-manager.service';
import { ModelPropertyTypeLibraryService } from '../injectable-wrappers/model-property-type-library.service';
import { ArraySerializerService } from '../injectable-wrappers/serialization/array-serializer.service';
import { ModelSerializerService } from '../injectable-wrappers/serialization/model-serializer.service';
import { ObjectSerializerService } from '../injectable-wrappers/serialization/object-serializer.service';
import { PrimitiveSerializerService } from '../injectable-wrappers/serialization/primitive-serializer.service';
import { SerializationManagerService } from '../injectable-wrappers/serialization/serialization-manager.service';
import { VariableSerializerService } from '../injectable-wrappers/serialization/variable-serializer.service';
import { ModelInjectService } from '../model/decorators/model-inject.service';
import { MODEL_PROPERTY_TYPES } from '../module/dashboard-core.module';

/**
 * Configures dashboard services for default behavior
 */
@Injectable({
  providedIn: 'root'
})
export class DefaultConfigurationService {
  private configured: boolean = false;

  public constructor(
    private readonly deserializationManager: DeserializationManagerService,
    private readonly objectDeserializer: ObjectDeserializerService,
    private readonly arrayDeserializer: ArrayDeserializerService,
    private readonly primitiveDeserializer: PrimitiveDeserializerService,
    private readonly modelDeserializer: ModelDeserializerService,
    private readonly variableDeserializer: VariableDeserializerService,
    private readonly modelManager: ModelManagerService,
    private readonly defaultModelApiBuilder: DefaultModelApiBuilderService,
    private readonly serializationManager: SerializationManagerService,
    private readonly objectSerializer: ObjectSerializerService,
    private readonly arraySerializer: ArraySerializerService,
    private readonly primitiveSerializer: PrimitiveSerializerService,
    private readonly modelSerializer: ModelSerializerService,
    private readonly variableSerializer: VariableSerializerService,
    private readonly propertyTypeLibrary: ModelPropertyTypeLibraryService,
    private readonly modelEventInstaller: ModelEventInstallerService,
    private readonly modelInjectService: ModelInjectService,
    private readonly injector: Injector,
    @Inject(MODEL_PROPERTY_TYPES) private readonly propertyTypes: PropertyTypeRegistration[][]
  ) {}

  /**
   * Does the configuration. This should be called during application bootstrap.
   *
   * @throws Error if configure is called more than once
   */
  public configure(): void {
    if (this.configured) {
      throw new Error('Default Configuration Service cannot be configured twice');
    }
    this.configured = true;
    this.registerPropertyTypes();
    this.configureDeserialization();
    this.configureSerialization();
    this.registerModelDecorators();
    this.configureModelApiBuilder();
  }

  private configureDeserialization(): void {
    this.deserializationManager.registerDeserializer(this.variableDeserializer);
    this.deserializationManager.registerDeserializer(this.primitiveDeserializer);
    this.deserializationManager.registerDeserializer(this.modelDeserializer);
    this.deserializationManager.registerDeserializer(this.arrayDeserializer);
    this.deserializationManager.registerDeserializer(this.objectDeserializer);
  }

  private configureSerialization(): void {
    this.serializationManager.registerSerializer(this.variableSerializer);
    this.serializationManager.registerSerializer(this.primitiveSerializer);
    this.serializationManager.registerSerializer(this.modelSerializer);
    this.serializationManager.registerSerializer(this.arraySerializer);
    this.serializationManager.registerSerializer(this.objectSerializer);
  }

  private configureModelApiBuilder(): void {
    this.modelManager.registerModelApiBuilder(this.defaultModelApiBuilder);
  }

  private registerPropertyTypes(): void {
    uniq(flatten(this.propertyTypes)).forEach(propertyType => {
      if (typeof propertyType === 'object') {
        this.propertyTypeLibrary.registerPropertyType(propertyType);
      } else {
        this.propertyTypeLibrary.registerPropertyType(this.injector.get(propertyType));
      }
    });
  }

  private registerModelDecorators(): void {
    this.modelManager.registerDecorator(this.modelEventInstaller);
    this.modelManager.registerDecorator(this.modelInjectService);
  }
}

type PropertyTypeRegistration =
  | ModelPropertyTypeRegistrationInformation
  | Type<ModelPropertyTypeRegistrationInformation>;
