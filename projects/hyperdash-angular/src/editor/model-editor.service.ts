import { Injectable, Injector, type Type } from '@angular/core';
import { type CompositeEditorData, EditorKind, type NestedEditorData } from '@hypertrace/hyperdash';
import { EditorApiFactoryService } from '../injectable-wrappers/editor-api-factory.service';
import { EditorLibraryService } from '../injectable-wrappers/editor-library.service';
import { EDITOR_API } from './editor-api-injection-token';
import { NestedModelEditorComponent } from './nested-model/nested-model-editor.component';

/**
 * Service which will accept a model and generate render data for it
 */
@Injectable({
  providedIn: 'root'
})
export class ModelEditorService {
  public constructor(
    private readonly editorLibraryService: EditorLibraryService,
    private readonly editorApiFactory: EditorApiFactoryService,
    private readonly injector: Injector
  ) {}

  /**
   * Looks up all editors and subeditors for this model, flattens them and converts them to a standard format
   * including an injector containing the editor api for each property editor.
   */
  public getRenderData(model: object): RenderableEditor[] {
    const editorData = this.editorLibraryService.getEditorData(model.constructor as Type<object>);
    if (!editorData) {
      return [];
    }

    return this.collectEditors(editorData, model);
  }

  private collectEditors(editorData: CompositeEditorData, model: object): RenderableEditor[] {
    const editorsToUse = editorData.subeditors;

    if (editorData.dataEditor) {
      editorsToUse.push(editorData.dataEditor);
    }

    if (editorData.themeEditor) {
      editorsToUse.push(editorData.themeEditor);
    }

    return editorsToUse.map(editor => {
      return this.getRenderableEditorForEditorData(editor, model);
    });
  }

  private createInjectorForEditorData(editorData: NestedEditorData, model: object): Injector {
    switch (editorData.kind) {
      case EditorKind.Leaf:
        return Injector.create({
          providers: [
            {
              provide: EDITOR_API,
              useValue: this.editorApiFactory.buildLeafEditorApi(model, editorData)
            }
          ],
          parent: this.injector
        });
      case EditorKind.Unresolved:
        return Injector.create({
          providers: [
            {
              provide: EDITOR_API,
              useValue: this.editorApiFactory.buildNestedEditorApi(model, editorData)
            }
          ],
          parent: this.injector
        });
      /* istanbul ignore next */
      default:
        // TODO multiple
        return this.injector;
    }
  }

  private getRenderableEditorForEditorData(editorData: NestedEditorData, model: object): RenderableEditor {
    return {
      component: this.getRendererComponentForEditorData(editorData),
      injector: this.createInjectorForEditorData(editorData, model)
    };
  }

  private getRendererComponentForEditorData(editorData: NestedEditorData): Type<unknown> {
    switch (editorData.kind) {
      case EditorKind.Leaf:
        return editorData.editor;
      case EditorKind.Unresolved:
      default:
        // Should never be a default
        return NestedModelEditorComponent;
    }
  }
}

export interface RenderableEditor {
  component: Type<unknown>;
  injector: Injector;
}
