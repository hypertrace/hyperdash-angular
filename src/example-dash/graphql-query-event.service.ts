import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModelScopedDashboardEvent, ModelScopedData } from '@hypertrace/hyperdash';
import { DashboardEventManagerService, ModelDestroyedEventService } from '@hypertrace/hyperdash-angular';
import { Observer } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GraphQlQueryEventService extends ModelScopedDashboardEvent<GraphQlQueryObject> {
  private readonly graphqlEndpoint: string = 'http://localhost:4000/graphql';

  public constructor(
    dashboardEventManager: DashboardEventManagerService,
    private readonly modelDestroyedEvent: ModelDestroyedEventService,
    private readonly httpClient: HttpClient
  ) {
    super(dashboardEventManager);

    this.getObservable().subscribe(event => this.onQueryEvent(event));
  }

  protected onQueryEvent(event: ModelScopedData<GraphQlQueryObject>): void {
    this.httpClient
      .post(this.graphqlEndpoint, {
        query: event.data.query
      })
      .pipe(
        takeUntil(
          this.modelDestroyedEvent.getObservable().pipe(filter(destroyedModel => destroyedModel === event.source))
        )
      )
      .subscribe(event.data.responseObserver);
  }
}

export interface GraphQlQueryObject {
  query: string;
  responseObserver: Observer<object>;
}
