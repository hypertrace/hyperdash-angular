import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { EditorApi, type ModelJson } from '@hypertrace/hyperdash';
import { EDITOR_API } from '../editor-api-injection-token';

/**
 * An editor for a model object, allowing arbitrary nesting of models
 */
/* istanbul ignore next */
@Component({
  selector: 'hda-nested-model-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ' To be Added! '
})
export class NestedModelEditorComponent {
  public constructor(@Inject(EDITOR_API) public readonly api: EditorApi<ModelJson>) {}
}
