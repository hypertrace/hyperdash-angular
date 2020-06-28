import { InjectionToken, ModuleWithProviders, NgModule, Type } from '@angular/core';
import {
  ARRAY_PROPERTY,
  BOOLEAN_PROPERTY,
  ModelPropertyTypeRegistrationInformation,
  NUMBER_PROPERTY,
  PLAIN_OBJECT_PROPERTY,
  STRING_PROPERTY,
  UNKNOWN_PROPERTY
} from '@hypertrace/hyperdash';
import { ModelPropertyTypeService } from '../injectable-wrappers/model-property-type.service';
import { DashboardModelDirective } from '../rendering/dashboard-model.directive';
import { DashboardComponent } from '../rendering/dashboard.component';
import { ThemePropertyPipe } from '../rendering/theme-property.pipe';

export const MODEL_PROPERTY_TYPES =
  // tslint:disable-next-line: max-line-length
  new InjectionToken<(ModelPropertyTypeRegistrationInformation | Type<ModelPropertyTypeRegistrationInformation>)[][]>(
    'MODEL_PROPERTY_TYPES'
  );

const RETAINED_REFERENCES = new InjectionToken<Type<object>[][]>('RETAINED_REFERENCES');

/**
 * Main dashboarding runtime angular module
 */
@NgModule({
  declarations: [DashboardModelDirective, DashboardComponent, ThemePropertyPipe],
  exports: [DashboardModelDirective, DashboardComponent, ThemePropertyPipe],
  providers: [
    {
      provide: MODEL_PROPERTY_TYPES,
      useValue: [
        STRING_PROPERTY,
        NUMBER_PROPERTY,
        BOOLEAN_PROPERTY,
        PLAIN_OBJECT_PROPERTY,
        UNKNOWN_PROPERTY,
        ARRAY_PROPERTY,
        ModelPropertyTypeService
      ],
      multi: true
    }
  ]
})
export class DashboardCoreModule {
  /* Retained references aren't currently accesible via injector (becasue the tokens are not exported). We don't
     need them via injector, but this prevents them from being tree shaken during a production build.
  */

  /**
   * Creates module with provided metadata
   */
  public static with(metadata: DashboardMetadata): ModuleWithProviders<DashboardCoreModule> {
    return {
      ngModule: DashboardCoreModule,
      providers: [
        {
          provide: MODEL_PROPERTY_TYPES,
          multi: true,
          // tslint:disable-next-line: strict-boolean-expressions
          useValue: metadata.propertyTypes || []
        },
        {
          provide: RETAINED_REFERENCES,
          multi: true,
          // tslint:disable-next-line: strict-boolean-expressions
          useValue: [...(metadata.models || []), ...(metadata.renderers || []), ...(metadata.editors || [])]
        }
      ]
    };
  }
}

export interface DashboardMetadata {
  /**
   * Models to be included. These are not directly used,
   * but including them here will prevent them from being tree shaken
   * if they are only referenced loosely.
   */
  models?: Type<unknown>[];

  /**
   * Renderers to be included. These are not directly used,
   * but including them here will prevent them from being tree shaken
   * if they are only referenced loosely.
   */
  renderers?: Type<unknown>[];

  /**
   * Editors to be included. These are not directly used,
   * but including them here will prevent them from being tree shaken
   * if they are only referenced loosely.
   */
  editors?: Type<unknown>[];

  /**
   * New property types to be registered, or injectable classes that implement a property type
   */
  propertyTypes?: (Type<ModelPropertyTypeRegistrationInformation> | ModelPropertyTypeRegistrationInformation)[];
}
