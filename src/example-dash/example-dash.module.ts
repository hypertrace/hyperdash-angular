import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardCoreModule } from '@hypertrace/hyperdash-angular';
import {
  ExampleContainer,
  ExampleContainerRendererComponent,
  ExampleDataSource,
  ExampleModel,
  ExampleRendererComponent,
  StringPropertyEditorComponent
} from './example-dash.component';

@NgModule({
  declarations: [ExampleContainerRendererComponent, ExampleRendererComponent, StringPropertyEditorComponent],
  entryComponents: [ExampleContainerRendererComponent, ExampleRendererComponent, StringPropertyEditorComponent],
  imports: [
    CommonModule,
    FormsModule,
    DashboardCoreModule.with({
      models: [ExampleDataSource, ExampleContainer, ExampleModel]
    })
  ]
})
export class ExampleDashModule {}
