import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataRefreshEventService } from '../../injectable-wrappers/data-refresh-event.service';
import { DefaultModelApiBuilderService } from '../../injectable-wrappers/default-model-api-builder.service';
import { TimeRangeChangedEventService } from '../../injectable-wrappers/time-range-changed-event.service';
import { RendererApi } from './renderer-api';

@Injectable({
  providedIn: 'root'
})
export class RendererApiFactoryService {
  public constructor(
    private readonly modelApiBuilder: DefaultModelApiBuilderService,
    private readonly dataRefreshEvent: DataRefreshEventService,
    private readonly timeRangeChangedEvent: TimeRangeChangedEventService
  ) {}

  public buildApi<TModel extends object>(model: TModel, rendererDestruction$: Observable<void>): RendererApi<TModel> {
    const modelApi = this.modelApiBuilder.build(model);

    return {
      model: model,
      getDataFromModelDataSource: () => modelApi.getData(),
      change$: modelApi.change$.pipe(takeUntil(rendererDestruction$)),
      getTheme: () => modelApi.getTheme(),
      dataRefresh$: this.dataRefreshEvent.getObservableForModel(model).pipe(takeUntil(rendererDestruction$)),
      timeRangeChanged$: this.timeRangeChangedEvent.getObservableForModel(model).pipe(takeUntil(rendererDestruction$)),
      getTimeRange: () => modelApi.getTimeRange()
    };
  }
}
