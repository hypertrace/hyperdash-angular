import { ModelApi, TimeRange } from '@hypertrace/hyperdash';
import { EMPTY, Observable } from 'rxjs';
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
      build: jest.fn(() => ({
        getData: jest.fn(),
        change$: mockModelChange$
      })) as jest.Mock
    };
    mockDataRefreshEvent = {
      getObservableForModel: jest.fn(() => mockRefresh$)
    };
    mockTimeRangeChangedEvent = {
      getObservableForModel: jest.fn(() => mockTimeRangeChanged$)
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
      getData: jest.fn().mockReturnValue(mockDataSource),
      getTheme: jest.fn().mockReturnValue(mockTheme),
      getTimeRange: jest.fn().mockReturnValue(mockTimeRange),
      change$: mockModelChange$
    };

    mockModelApiBuilder.build = jest.fn(() => mockModelApi as ModelApi);

    const rendererApi = rendererApiFactory.buildApi(mockModel, EMPTY);

    expect(rendererApi.getDataFromModelDataSource()).toBe(mockDataSource);
    expect(mockModelApi.getData).toHaveBeenCalled();

    expect(rendererApi.getTheme()).toBe(mockTheme);
    expect(mockModelApi.getTheme).toHaveBeenCalled();

    expect(rendererApi.getTimeRange()).toBe(mockTimeRange);
    expect(mockModelApi.getTimeRange).toHaveBeenCalled();
  });
});
