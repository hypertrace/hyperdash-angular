import { type AbstractType, Injectable, InjectionToken, Injector, type Type } from '@angular/core';
import { type ModelApi, type ModelDecorator } from '@hypertrace/hyperdash';

export const MODEL_API = new InjectionToken<ModelApi>('MODEL_API');

const injectDefinitions: ModelInjectData[] = [];

@Injectable({ providedIn: 'root' })
export class ModelInjectService implements ModelDecorator {
  private readonly injectData: WeakMap<Type<unknown>, ModelInjectData[]> = new Map();

  private lastDefinitionIndexRead: number = 0;

  public constructor(private readonly injector: Injector) {}

  public decorate(modelInstance: Record<string, unknown>, api: ModelApi): void {
    this.processDefinitionQueue();
    const injector = this.createInjectorWithApi(api);
    this.getRequestedInjects(modelInstance).forEach(injectData => {
      modelInstance[injectData.propertyKey] = injector.get(injectData.injectKey);
    });
  }

  private createInjectorWithApi(api: ModelApi): Injector {
    /*
    We could introduce an optional parent injector at model creation but that would require some work.
    It could alsso be confusing (different scope for renderer injector vs model) and doesn't seem necessary at this point.
    */
    return Injector.create({
      parent: this.injector,
      providers: [
        {
          provide: MODEL_API,
          useValue: api
        }
      ]
    });
  }

  private getRequestedInjects(modelInstance: object): ModelInjectData[] {
    return Array.from(
      new Map(
        this.getConstructorChain(modelInstance)
          .reverse() // Starting at the base of the inheritance chain, so descendents overwrite parents
          .map(constructor => {
            return this.injectData.get(constructor) ?? [];
          })
          .flat()
          .map(injectData => {
            return [injectData.propertyKey, injectData];
          })
      ).values()
    );
  }

  private addInjectData(data: ModelInjectData): void {
    const injectArray = this.injectData.get(data.injectHostClass) ?? [];
    injectArray.push(data);
    this.injectData.set(data.injectHostClass, injectArray);
  }

  private processDefinitionQueue(): void {
    for (
      this.lastDefinitionIndexRead;
      this.lastDefinitionIndexRead < injectDefinitions.length;
      this.lastDefinitionIndexRead++
    ) {
      this.addInjectData(injectDefinitions[this.lastDefinitionIndexRead]);
    }
  }

  /**
   * Provides an array of constructors, starting with the provided and working up the hierarchy
   */
  private getConstructorChain(modelInstance: object): Type<unknown>[] {
    let currentConstructor: Type<unknown> | undefined = modelInstance.constructor as Type<unknown>;
    const constructorChain: Type<unknown>[] = [];

    while (currentConstructor) {
      constructorChain.push(currentConstructor);
      currentConstructor = Object.getPrototypeOf(currentConstructor) as Type<unknown> | undefined;
    }

    return constructorChain;
  }
}

// TS limitation prevents symbols as index types ( https://github.com/microsoft/TypeScript/issues/1863 ). Also prevents unions. And type aliases.
// We'll hardcode in the index declaration, and use this on the other side.
// Symbols would still work at runtime if used, and the decorators don't enforce types anyway.
type PropertyKey = number | string;

interface ModelInjectData {
  injectHostClass: Type<unknown>;
  propertyKey: PropertyKey;
  injectKey: AbstractType<unknown> | InjectionToken<unknown> | Type<unknown>;
}

/**
 * Registers the decorated property for injection usisng the provided DI token. This will be resolved
 * against the root of the DI tree, with one special token available for resolving the model api:
 * `MODEL_API`
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions, @typescript-eslint/naming-convention
export function ModelInject(
  injectKey: AbstractType<unknown> | InjectionToken<unknown> | Type<unknown>
): PropertyDecorator {
  return (modelPrototype: object, propertyKey: string | symbol): void => {
    injectDefinitions.push({
      injectHostClass: modelPrototype.constructor as Type<unknown>,
      propertyKey: propertyKey as PropertyKey,
      injectKey: injectKey
    });
  };
}
