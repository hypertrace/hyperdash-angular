import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DashboardCoreModule, DashboardEditorModule, DefaultConfigurationService } from '@hypertrace/hyperdash-angular';
import { ExampleDashComponent } from '../example-dash/example-dash.component';
import { ExampleDashModule } from '../example-dash/example-dash.module';
import { GraphQlDataSourceModule } from '../example-dash/graphql-data-source.module';
import { AppComponent } from './app.component';
@NgModule({
  declarations: [AppComponent, ExampleDashComponent],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    GraphQlDataSourceModule,
    ExampleDashModule,
    DashboardCoreModule,
    DashboardEditorModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  public constructor(defaultConfigurationService: DefaultConfigurationService) {
    defaultConfigurationService.configure();
  }
}
