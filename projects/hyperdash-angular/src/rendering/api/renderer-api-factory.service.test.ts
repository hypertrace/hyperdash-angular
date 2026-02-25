import { ModelApi, TimeRange } from '@hypertrace/hyperdash';
import { EMPTY, Observable } from 'rxjs';
import { vi } from 'vitest';
import { DataRefreshEventService } from '../../injectable-wrappers/data-refresh-event.service';
import { DefaultModelApiBuilderService } from '../../injectable-wrappers/default-model-api-builder.service';
import { TimeRangeChangedEventService } from '../../injectable-wrappers/time-range-changed-event.service';
import { getTestScheduler } from '../../test/test-utils';
import { RendererApiFactoryService } from './renderer-api-factory.service';

describe('Renderer API Factory', () => {
  let rendererApiFactory: RendererApiFactoryService;
  let mockModelApiBuilder: Partial<DefaultModelApiBuilderService>;
  let mockDataRefreshEvent: Partial<DataRefreshEventService>;
  let mockTimeRangeChangedEvent: Partial<TimeRangeChangedEventService>;
  let mockModelChange$: Observable<void>;
  let mockRefresh$: Observable<undefined>;
  let mockTimeRangeChanged$: Observable<TimeRange>;
  let mockModel: object;

  beforeEach(() => {
    mockModelApiBuilder = {
      build: vi.fn(() => ({
        getData: vi.fn(),
        change$: mockModelChange$
      }))
    } as unknown as Partial<DefaultModelApiBuilderService>;
    mockDataRefreshEvent = {
      getObservableForModel: vi.fn(() => mockRefresh$)
    };
    mockTimeRangeChangedEvent = {
      getObservableForModel: vi.fn(() => mockTimeRangeChanged$)
    };
    mockModelChange$ = EMPTY;
    mockRefresh$ = EMPTY;
    mockTimeRangeChanged$ = EMPTY;
    mockModel = {};

    rendererApiFactory = new RendererApiFactoryService(
      mockModelApiBuilder as DefaultModelApiBuilderService,
      mockDataRefreshEvent as DataRefreshEventService,
      mockTimeRangeChangedEvent as TimeRangeChangedEventService
    );
  });

  test('ends observables on renderer destruction', () => {
    getTestScheduler().run(({ cold, expectObservable }) => {
      mockModelChange$ = cold<undefined>('-x-x');
      mockRefresh$ = cold<undefined>('x--x');
      mockTimeRangeChanged$ = cold('xxx');
      const rendererDestruction$ = cold<undefined>('--x');

      const rendererApi = rendererApiFactory.buildApi(mockModel, rendererDestruction$);

      expectObservable(rendererApi.change$).toBe('-x|');
      expectObservable(rendererApi.dataRefresh$).toBe('x-|');
      expectObservable(rendererApi.timeRangeChanged$).toBe('xx|');
    });
  });

  test('delegates method calls', () => {
    const mockDataSource = {};
    const mockTimeRange = {};
    const mockTheme = {};

    const mockModelApi: Partial<ModelApi> = {
      getData: vi.fn().mockReturnValue(mockDataSource),
      getTheme: vi.fn().mockReturnValue(mockTheme),
      getTimeRange: vi.fn().mockReturnValue(mockTimeRange),
      change$: mockModelChange$
    };

    mockModelApiBuilder.build = vi.fn(() => mockModelApi as ModelApi);

    const rendererApi = rendererApiFactory.buildApi(mockModel, EMPTY);

    expect(rendererApi.getDataFromModelDataSource()).toBe(mockDataSource);
    expect(mockModelApi.getData).toHaveBeenCalled();

    expect(rendererApi.getTheme()).toBe(mockTheme);
    expect(mockModelApi.getTheme).toHaveBeenCalled();

    expect(rendererApi.getTimeRange()).toBe(mockTimeRange);
    expect(mockModelApi.getTimeRange).toHaveBeenCalled();
  });
});
