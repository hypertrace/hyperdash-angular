import { EMPTY, Observable } from 'rxjs';
import { ModelChangedEventService } from '../injectable-wrappers/model-changed-event.service';
import { ModelManagerService } from '../injectable-wrappers/model-manager.service';
import { ThemeManagerService } from '../injectable-wrappers/theme-manager.service';
import { getTestScheduler } from '../test/test-utils';
import { RendererApi } from './api/renderer-api';
import { ThemePropertyPipe } from './theme-property.pipe';

describe('Theme property pipe', () => {
  let pipe: ThemePropertyPipe;
  let mockModel: object;
  let mockRoot: object;
  let mockRendererApi: Partial<RendererApi<object>>;
  let mockThemeManager: Partial<ThemeManagerService>;
  let mockModelManager: Partial<ModelManagerService>;
  let mockModelChanged: Partial<ModelChangedEventService>;
  let mockModelChangeObservable: Observable<object>;

  const buildPipe = () => {
    pipe = new ThemePropertyPipe(
      mockRendererApi as RendererApi<object>,
      mockThemeManager as ThemeManagerService,
      mockModelManager as ModelManagerService,
      mockModelChanged as ModelChangedEventService
    );
  };

  beforeEach(() => {
    mockModel = {};
    mockRoot = {};
    mockThemeManager = {};
    mockRendererApi = { model: mockModel };
    mockModelManager = {
      getRoot: jest.fn().mockReturnValue(mockRoot)
    };

    mockModelChangeObservable = EMPTY;
    mockModelChanged = {
      getObservableForModel: jest.fn(() => mockModelChangeObservable)
    };
  });

  test('should delegate to theme manager', () => {
    buildPipe();
    mockThemeManager.getThemePropertyForModel = jest.fn();
    pipe.transform('test-string');
    expect(mockThemeManager.getThemePropertyForModel).toHaveBeenCalledWith(mockModel, 'test-string');
  });

  test('should cache value only if matched previous request', () => {
    buildPipe();
    mockThemeManager.getThemePropertyForModel = jest.fn();
    pipe.transform('test-string');
    pipe.transform('test-string');
    expect(mockThemeManager.getThemePropertyForModel).toHaveBeenCalledTimes(1);

    pipe.transform('test-other-string');
    expect(mockThemeManager.getThemePropertyForModel).toHaveBeenCalledTimes(2);
  });

  test('should re-request value if an ancestor model has changed', () => {
    getTestScheduler().run(({ cold, flush }) => {
      mockModelChangeObservable = cold('x');
      buildPipe();
      mockThemeManager.getThemePropertyForModel = jest.fn();
      pipe.transform('test-string');
      flush();
      pipe.transform('test-string');
      expect(mockThemeManager.getThemePropertyForModel).toHaveBeenCalledTimes(2);
    });
  });

  test('should unsubscribe from model change on destruction', () => {
    getTestScheduler().run(({ cold, expectSubscriptions }) => {
      const coldMock = cold<object>('x');
      mockModelChangeObservable = coldMock;
      buildPipe();
      mockThemeManager.getThemePropertyForModel = jest.fn();
      // eslint-disable-next-line: no-lifecycle-call
      pipe.ngOnDestroy();

      expectSubscriptions(coldMock.subscriptions).toBe('(^!)');
    });
  });
});
