import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { EditorApi, ModelJson } from '@hypertrace/hyperdash';
import { EDITOR_API } from '../editor-api-injection-token';
import { ModelJsonEditorComponent } from '../model-json/model-json-editor.component';

/**
 * An editor for a model object, allowing arbitrary nesting of models
 */
/* istanbul ignore next */
@Component({
  selector: 'hda-nested-model-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<hda-model-json-editor [modelJson]="api.value" (modelJsonChange)="api.valueChange($event)" /> ',
  standalone: true,
  imports: [ModelJsonEditorComponent]
})
export class NestedModelEditorComponent {
  public constructor(@Inject(EDITOR_API) public readonly api: EditorApi<ModelJson>) {}
}
