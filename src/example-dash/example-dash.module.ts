import { NgModule } from '@angular/core';
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
  imports: [
    ExampleDashComponent,
    ExampleContainerRendererComponent,
    ExampleRendererComponent,
    StringPropertyEditorComponent,
    DashboardCoreModule.with({
      models: [ExampleDataSource, ExampleContainer, ExampleModel]
    })
  ],
  exports: [ExampleDashComponent]
})
export class ExampleDashModule {}
