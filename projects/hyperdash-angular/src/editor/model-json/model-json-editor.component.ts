import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { DeserializationManagerService } from '../../injectable-wrappers/deserialization/deserialization-manager.service';
import { ModelChangedEventService } from '../../injectable-wrappers/model-changed-event.service';
import { ModelManagerService } from '../../injectable-wrappers/model-manager.service';
import { SerializationManagerService } from '../../injectable-wrappers/serialization/serialization-manager.service';
import { ModelEditorService, RenderableEditor } from '../model-editor.service';

/**
 * A dynamic editor generated based on the provided model json.
 */
@Component({
  selector: 'hda-model-json-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ' <hda-model-editor [model]="modelObject"></hda-model-editor> '
})
export class ModelJsonEditorComponent implements OnChanges, OnDestroy {
  /**
   * Model to be edited
   */
  @Input()
  public modelJson?: object;

  @Output()
  public readonly modelJsonChange: EventEmitter<object> = new EventEmitter<object>();

  public modelObject?: object;
  /**
   * Discovered subeditors for the provided model, signifying the editable properties or subproperties.
   */
  public subeditors: RenderableEditor[] = [];

  public constructor(
    private readonly modelEditorService: ModelEditorService,
    private readonly modelManager: ModelManagerService,
    private readonly modelChangedEvent: ModelChangedEventService,
    private readonly deserializationManager: DeserializationManagerService,
    private readonly serializationManager: SerializationManagerService
  ) {}

  public ngOnChanges(): void {
    if (!this.modelJson) {
      return;
    }

    this.modelManager.destroy(this.modelObject);
    // TODO this won't have access to variables, data etc. (anything based on model tree)
    // One way of fixing this would be to include a context token in render data that doesn't reveal
    // The model, but allows us to internally use it to lookup values
    this.modelObject = this.deserializationManager.deserialize<object>(this.modelJson);
    this.modelChangedEvent
      .getObservableForModel(this.modelObject)
      .subscribe(() => this.modelJsonChange.emit(this.serializationManager.serialize(this.modelObject)));
    this.subeditors = this.modelEditorService.getRenderData(this.modelObject);
  }

  public ngOnDestroy(): void {
    this.modelManager.destroy(this.modelObject);
  }
}
