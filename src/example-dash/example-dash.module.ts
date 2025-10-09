import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardCoreModule } from '@hypertrace/hyperdash-angular';
import {
  ExampleContainer,
  ExampleContainerRendererComponent,
  ExampleDashComponent,
  ExampleDataSource,
  ExampleModel,
  ExampleRendererComponent,
  StringPropertyEditorComponent
} from './example-dash.component';

@NgModule({
  declarations: [
    ExampleDashComponent,
    ExampleContainerRendererComponent,
    ExampleRendererComponent,
    StringPropertyEditorComponent
  ],
  exports: [ExampleDashComponent],
  imports: [
    CommonModule,
    FormsModule,
    DashboardCoreModule.with({
      models: [ExampleDataSource, ExampleContainer, ExampleModel]
    })
  ]
})
export class ExampleDashModule {}
