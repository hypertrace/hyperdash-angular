import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModelJsonEditorComponent } from './model-json/model-json-editor.component';
import { ModelEditorComponent } from './model/model-editor.component';
import { NestedModelEditorComponent } from './nested-model/nested-model-editor.component';

/**
 * Angular module for the model editor component
 */
@NgModule({
  declarations: [ModelEditorComponent, ModelJsonEditorComponent, NestedModelEditorComponent],
  exports: [ModelEditorComponent, ModelJsonEditorComponent],
  entryComponents: [NestedModelEditorComponent],
  imports: [CommonModule]
})
export class DashboardEditorModule {}
