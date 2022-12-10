import {
  type DataSource,
  dataSourceMarker,
  Model,
  ModelEventPublisher,
  ModelProperty,
  STRING_PROPERTY
} from '@hypertrace/hyperdash';
import { type Observable, Subject } from 'rxjs';
import { GraphQlQueryEventService, type GraphQlQueryObject } from './graphql-query-event.service';

@Model({
  type: 'graphql-data-source'
})
export class GraphQlDataSource implements DataSource<object> {
  @ModelEventPublisher(GraphQlQueryEventService)
  public readonly query$ = new Subject<GraphQlQueryObject>();

  public readonly dataSourceMarker: typeof dataSourceMarker = dataSourceMarker;

  @ModelProperty({
    key: 'query',
    type: STRING_PROPERTY.type
  })
  public readonly query!: string;

  public getData(): Observable<object> {
    const resultSubject = new Subject<object>();

    this.query$.next({
      query: this.query,
      responseObserver: resultSubject
    });

    return resultSubject.asObservable();
  }
}
