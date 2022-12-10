import { type AbstractType, Inject, Injectable, Injector, type Type } from '@angular/core';
import { type Deserializer, type ModelPropertyTypeRegistrationInformation } from '@hypertrace/hyperdash';
import { flatten, uniq } from 'lodash-es';
import { DefaultModelApiBuilderService } from '../injectable-wrappers/default-model-api-builder.service';
import { DeserializationManagerService } from '../injectable-wrappers/deserialization/deserialization-manager.service';
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
import { DASHBOARD_DESERIALIZERS, MODEL_PROPERTY_TYPES } from '../module/dashboard-core.module';

/**
 * Configures dashboard services for default behavior
 */
@Injectable({
  providedIn: 'root'
})
export class DefaultConfigurationService {
  private configured: boolean = false;

  private readonly registeredObjects = new WeakSet();

  public constructor(
    private readonly deserializationManager: DeserializationManagerService,
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
    @Inject(MODEL_PROPERTY_TYPES) private readonly propertyTypes: PropertyTypeRegistration[][],
    @Inject(DASHBOARD_DESERIALIZERS)
    private readonly deserializers: (AbstractType<Deserializer> | Type<Deserializer>)[][]
  ) {}

  /**
   * Does the configuration. This should be called during application bootstrap. Later calls will
   * do incremental configuration.
   *
   */
  public configure(): void {
    this.registerPropertyTypes();
    this.registerDeserializers();

    if (this.configured) {
      return;
    }
    this.configured = true;
    // Beyond here, code should only be invoked once
    this.configureSerialization();
    this.registerModelDecorators();
    this.configureModelApiBuilder();
  }

  private registerDeserializers(): void {
    uniq(flatten(this.deserializers)).forEach(deserializerClass => {
      if (this.registeredObjects.has(deserializerClass)) {
        return;
      }
      this.registeredObjects.add(deserializerClass);

      this.deserializationManager.registerDeserializer(this.injector.get(deserializerClass));
    });
  }

  private configureSerialization(): void {
    // TODO - expose customizing serializers similar to deserializers
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
      if (this.registeredObjects.has(propertyType)) {
        return;
      }
      this.registeredObjects.add(propertyType);

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
