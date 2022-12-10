import { InjectionToken } from '@angular/core';
import { type MergedTheme, type Theme, type TimeRange } from '@hypertrace/hyperdash';
import { type Observable } from 'rxjs';

// TODO should this be moved down to core?
export interface RendererApi<TModel extends object> {
  /**
   * Retrieves the model associated with this renderer
   */
  model: TModel;
  /**
   * Retrieves data from a model's data source following the semantics of
   * ModelApi.getData()
   */
  getDataFromModelDataSource: <T>() => Observable<T>;
  /**
   * Notifies when the associated model, or one of its descendents changes.
   * It will be completed when the model is destroyed, and generally should not require
   * manually unsubscribing.
   */
  change$: Observable<void>;
  /**
   * Retrieves the merged theme specified for the model associated with this renderer.
   */
  getTheme: <T extends Theme>() => MergedTheme<T>;
  /**
   * Notifies when a refresh has been requested for the associated model, or one of its ancestors.
   * It will be completed when the model is destroyed, and generally should not require
   * manually unsubscribing.
   */
  dataRefresh$: Observable<void>;

  /**
   * Notifies when the time range applicable to the associated model has changed.
   * It wil be completed when the model is destroyed, and generally should not require manually
   * unsubscribing
   */
  timeRangeChanged$: Observable<TimeRange>;

  /**
   * Time range for associated model. See ModelApi.getTimeRange()
   */
  getTimeRange: () => TimeRange | undefined;
}

export const RENDERER_API = new InjectionToken<RendererApi<object>>('Renderer API');
