import {
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  Injector,
  Type,
  ViewContainerRef
} from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ModelDestroyedEventService } from '../injectable-wrappers/model-destroyed-event.service';
import { ModelManagerService } from '../injectable-wrappers/model-manager.service';
import { RendererLibraryService } from '../injectable-wrappers/renderer-library.service';
import { RENDERER_API } from './api/renderer-api';
import { RendererApiFactoryService } from './api/renderer-api-factory.service';

/**
 * Angular adapter to convert a model instance into a DOM element
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardRendererService {
  private readonly renderedComponentByModel: Map<object, RenderedComponent> = new Map();
  private readonly domEventSubscribers: Map<object, DomEventSubscriber[]> = new Map();

  public constructor(
    private readonly rendererLibrary: RendererLibraryService,
    private readonly modelManager: ModelManagerService,
    private readonly modelDestroyedEvent: ModelDestroyedEventService,
    private readonly rendererApiFactory: RendererApiFactoryService
  ) {}

  /**
   * Creates the renderer associated with the provided model inside the view container. The model itself
   * is made available for injection to the renderer.
   */
  public renderInViewContainer<TRenderer>(model: object, viewContainerRef: ViewContainerRef): ComponentRef<TRenderer> {
    viewContainerRef.clear();

    const rendererDestructionSubject = new Subject<void>();

    const componentRef = viewContainerRef.createComponent<TRenderer>(
      this.buildRendererFactory(model, viewContainerRef),
      0,
      this.buildInjector(model, rendererDestructionSubject.asObservable(), viewContainerRef)
    );

    componentRef.onDestroy(() => {
      rendererDestructionSubject.next();
      rendererDestructionSubject.complete();
    });

    this.renderedComponentByModel.set(model, {
      componentRef: componentRef,
      componentDestruction$: rendererDestructionSubject.asObservable()
    });

    this.findMatchingSubscribers(model).forEach(subscriber =>
      this.addEventSubscriptionForRenderedModel(model, subscriber)
    );

    // If the renderer is destroyed, remove the model
    rendererDestructionSubject.subscribe(() => this.renderedComponentByModel.delete(model));
    // If the renderer and model are destroyed at the same time, we need to clean up immediately.
    // The renderer destruction fires asynchronously
    this.modelDestroyedEvent
      .getDestructionObservable(model)
      .pipe(takeUntil(rendererDestructionSubject))
      .subscribe(() => this.renderedComponentByModel.delete(model));

    return componentRef;
  }

  /**
   * Provides an observable of the requested event on any widget renderer whose model
   * matches or is a descendent of the provided `rootModel`. Provides the model,
   * renderer and event objects. Completes when `rootModel` is destroyed.
   */
  public getObservableForRendererDomEvent<
    TEventName extends keyof GlobalEventHandlersEventMap,
    TModel extends object,
    TRenderer extends unknown
  >(
    eventName: TEventName,
    rootModel: object
  ): Observable<RendererDomEvent<GlobalEventHandlersEventMap[TEventName], TModel, TRenderer>> {
    // This will need to add subscribers for already rendered models as well

    // Subscribe to event for each matching rendered widget, piping value to this returned observable
    const eventSubject = new Subject<RendererDomEvent<GlobalEventHandlersEventMap[TEventName], TModel, TRenderer>>();

    const subscriber: DomEventSubscriber = {
      event: eventName,
      rootModel: rootModel,
      eventSubject: eventSubject as unknown as Subject<RendererDomEvent<Event, object, unknown>> // TODO better cast?
    };
    const subscribers = this.domEventSubscribers.get(rootModel) ?? [];
    subscribers.push(subscriber);
    this.domEventSubscribers.set(rootModel, subscribers);

    this.findMatchingRenderedModels(subscriber.rootModel).forEach(model =>
      this.addEventSubscriptionForRenderedModel(model, subscriber)
    );

    this.modelDestroyedEvent
      .getDestructionObservable(rootModel)
      .subscribe(() => this.cleanupSubscribersForRootModel(rootModel));

    return eventSubject.asObservable();
  }

  private buildRendererFactory<TRenderer>(
    model: object,
    viewContainerRef: ViewContainerRef
  ): ComponentFactory<TRenderer> {
    /* Get it from the appropriate injector based on usage location. Need to jump through hoops here
    because ComponentFactoryResolver is an abstract type which doesn't play nice with generics */
    const resolver = viewContainerRef.injector.get(
      ComponentFactoryResolver as unknown as Type<ComponentFactoryResolver>
    );

    const renderer = this.rendererLibrary.lookupRenderer(model.constructor as Type<unknown>) as Type<TRenderer>;

    return resolver.resolveComponentFactory(renderer);
  }

  private buildInjector(
    model: object,
    rendererDestruction$: Observable<void>,
    viewContainerRef: ViewContainerRef
  ): Injector {
    return Injector.create(
      [
        {
          provide: RENDERER_API,
          useValue: this.rendererApiFactory.buildApi(model, rendererDestruction$)
        }
      ],
      viewContainerRef.injector
    );
  }

  private addEventSubscriptionForRenderedModel(model: object, subscriber: DomEventSubscriber): void {
    const rendererInfo = this.renderedComponentByModel.get(model);
    if (!rendererInfo) {
      // Should not be hit, this is checked externally. Extra safety.
      /* istanbul ignore next */
      return;
    }
    const rendererElement = rendererInfo.componentRef.location.nativeElement as Element;

    fromEvent(rendererElement, subscriber.event)
      .pipe(
        map(event => ({
          domEvent: event,
          model: model,
          componentRef: rendererInfo.componentRef
        })),
        takeUntil(rendererInfo.componentDestruction$)
      )
      .subscribe({
        next: value => subscriber.eventSubject.next(value)
      });
  }

  private cleanupSubscribersForRootModel(model: object): void {
    const subscribers = this.domEventSubscribers.get(model) ?? [];
    subscribers.forEach(subscriber => {
      subscriber.eventSubject.complete();
    });
    this.domEventSubscribers.delete(model);
  }

  private findMatchingRenderedModels(rootModel: object): object[] {
    return Array.from(this.renderedComponentByModel.keys()).filter(
      model => model === rootModel || this.modelManager.isAncestor(model, rootModel)
    );
  }

  private findMatchingSubscribers(renderedModel: object): DomEventSubscriber[] {
    const subscribers: DomEventSubscriber[] = [];
    let currentModel: object | undefined = renderedModel;

    while (currentModel) {
      subscribers.push(...(this.domEventSubscribers.get(currentModel) ?? []));
      currentModel = this.modelManager.getParent(currentModel);
    }

    return subscribers;
  }
}

export interface RendererDomEvent<TEvent extends Event, TModel extends object, TRenderer extends unknown> {
  domEvent: TEvent;
  model: TModel;
  componentRef: ComponentRef<TRenderer>;
}

interface DomEventSubscriber {
  rootModel: object;
  event: string;
  eventSubject: Subject<RendererDomEvent<Event, object, unknown>>;
}

interface RenderedComponent {
  componentRef: ComponentRef<unknown>;
  componentDestruction$: Observable<void>;
}
