import { Injector } from '@angular/core';
import { EditorKind, LeafEditorData, UnresolvedCompositeEditorData } from '@hypertrace/hyperdash';
import { EditorApiFactoryService } from '../injectable-wrappers/editor-api-factory.service';
import { EditorLibraryService } from '../injectable-wrappers/editor-library.service';
import { EDITOR_API } from './editor-api-injection-token';
import { ModelEditorService } from './model-editor.service';
import { NestedModelEditorComponent } from './nested-model/nested-model-editor.component';

describe('Model editor service', () => {
  let modelEditorService: ModelEditorService;
  let mockEditorLibrary: Partial<EditorLibraryService>;
  let mockInjector: Injector;
  let mockEditorApiFactory: Partial<EditorApiFactoryService>;
  const modelClass = class {};
  const editorClass1 = class {};
  const editorClass2 = class {};
  let model: object;

  beforeEach(() => {
    mockEditorApiFactory = {
      buildLeafEditorApi: jest.fn((_, editorData: LeafEditorData) => `${editorData.title} LEAF API`) as jest.Mock,
      buildNestedEditorApi: jest.fn((_, data: UnresolvedCompositeEditorData) => `${data.title} NESTED API`) as jest.Mock
    };
    mockInjector = Injector.create({ providers: [] });
    model = new modelClass();
    mockEditorLibrary = {
      getEditorData: jest.fn(providedModelClass => {
        if (providedModelClass !== modelClass) {
          return undefined;
        }

        return {
          title: 'Model editor',
          kind: EditorKind.Composite,
          subeditors: [
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            {
              title: 'first prop editor',
              editor: editorClass1,
              kind: EditorKind.Leaf
            } as LeafEditorData,
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            {
              title: 'second prop editor',
              editor: editorClass2,
              kind: EditorKind.Leaf
            } as LeafEditorData
          ]
        };
      })
    };

    modelEditorService = new ModelEditorService(
      mockEditorLibrary as EditorLibraryService,
      mockEditorApiFactory as EditorApiFactoryService,
      mockInjector
    );
  });

  test('should return editor data for mode', () => {
    expect(modelEditorService.getRenderData(model)).toEqual([
      expect.objectContaining({
        component: editorClass1
      }),
      expect.objectContaining({
        component: editorClass2
      })
    ]);
  });

  test('should return empty editor data if model is not recognized', () => {
    expect(modelEditorService.getRenderData({})).toEqual([]);
  });

  test('creates injector providing leaf editor api for each editor', () => {
    const renderData = modelEditorService.getRenderData(model);

    expect(renderData[0].injector.get(EDITOR_API)).toBe('first prop editor LEAF API');
    expect(mockEditorApiFactory.buildLeafEditorApi).nthCalledWith(1, model, {
      editor: editorClass1,
      title: 'first prop editor',
      kind: EditorKind.Leaf
    });

    expect(renderData[1].injector.get(EDITOR_API)).toBe('second prop editor LEAF API');
    expect(mockEditorApiFactory.buildLeafEditorApi).nthCalledWith(2, model, {
      editor: editorClass2,
      title: 'second prop editor',
      kind: EditorKind.Leaf
    });
  });

  test('creates render data for nested models', () => {
    mockEditorLibrary.getEditorData = jest.fn().mockReturnValue({
      title: 'Model editor',
      kind: EditorKind.Composite,
      subeditors: [
        {
          title: 'first prop model editor',
          kind: EditorKind.Unresolved
        }
      ]
    });

    const renderData = modelEditorService.getRenderData(model);
    expect(renderData[0].injector.get(EDITOR_API)).toBe('first prop model editor NESTED API');
    expect(renderData[0].component).toBe(NestedModelEditorComponent);
    expect(mockEditorApiFactory.buildNestedEditorApi).nthCalledWith(1, model, {
      kind: EditorKind.Unresolved,
      title: 'first prop model editor'
    });
  });

  test('creates render data for theme model', () => {
    mockEditorLibrary.getEditorData = jest.fn().mockReturnValue({
      title: 'Model editor',
      kind: EditorKind.Composite,
      subeditors: [],
      themeEditor: {
        title: 'Theme',
        kind: EditorKind.Unresolved
      }
    });

    const renderData = modelEditorService.getRenderData(model);
    expect(renderData[0].injector.get(EDITOR_API)).toBe('Theme NESTED API');
    expect(renderData[0].component).toBe(NestedModelEditorComponent);
    expect(mockEditorApiFactory.buildNestedEditorApi).nthCalledWith(1, model, {
      kind: EditorKind.Unresolved,
      title: 'Theme'
    });
  });

  test('creates render data for data model', () => {
    mockEditorLibrary.getEditorData = jest.fn().mockReturnValue({
      title: 'Model editor',
      kind: EditorKind.Composite,
      subeditors: [],
      dataEditor: {
        title: 'Data',
        kind: EditorKind.Unresolved
      }
    });

    const renderData = modelEditorService.getRenderData(model);
    expect(renderData[0].injector.get(EDITOR_API)).toBe('Data NESTED API');
    expect(renderData[0].component).toBe(NestedModelEditorComponent);
    expect(mockEditorApiFactory.buildNestedEditorApi).nthCalledWith(1, model, {
      kind: EditorKind.Unresolved,
      title: 'Data'
    });
  });
});
