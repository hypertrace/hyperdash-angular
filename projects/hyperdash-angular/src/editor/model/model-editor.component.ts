import { ChangeDetectionStrategy, Component, OnChanges, OnDestroy, input, output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModelChangedEventService } from '../../injectable-wrappers/model-changed-event.service';
import { ModelEditorService, RenderableEditor } from '../model-editor.service';

/**
 * A dynamic editor generated based on the provided model
 */
@Component({
  selector: 'hda-model-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (subeditor of subeditors; track subeditor.component) {
      <ng-container *ngComponentOutlet="subeditor.component; injector: subeditor.injector" />
    }
  `,
  standalone: false
})
export class ModelEditorComponent implements OnChanges, OnDestroy {
  /**
   * Model to be edited
   */
  public readonly model = input<object>();

  /**
   * Emitted when any attribute in the model changes. Assume this is a new model from the input. If the changes
   * are accepted, the original must be destroyed.
   *
   * TODO - eventually, would like to treat input model as immutable but that requires some thought.
   * Would need to clone variable, theme, data state as well as figure out how to destroy the original
   */
  public readonly modelChange = output<object>();

  /**
   * Discovered subeditors for the provided model, signifying the editable properties or subproperties.
   */
  public subeditors: RenderableEditor[] = [];

  private modelChangeSubscription?: Subscription;

  public constructor(
    private readonly modelEditorService: ModelEditorService,
    private readonly modelChangedEvent: ModelChangedEventService
  ) {}

  public ngOnChanges(): void {
    const model = this.model();
    if (!model) {
      return;
    }

    this.unsubscribeModelChanges();
    this.subeditors = this.modelEditorService.getRenderData(model);

    this.modelChangeSubscription = this.modelChangedEvent.getObservableForModel(model).subscribe(() => {
      const model = this.model();
      if (model) {
        this.modelChange.emit(model);
      }
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribeModelChanges();
  }

  private unsubscribeModelChanges(): void {
    if (this.modelChangeSubscription) {
      this.modelChangeSubscription.unsubscribe();
    }
  }
}
