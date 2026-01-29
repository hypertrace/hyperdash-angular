import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardCoreModule, DashboardEditorModule } from '@hypertrace/hyperdash-angular';
import { ExampleDashModule } from '../example-dash/example-dash.module';
import { GraphQlDataSourceModule } from '../example-dash/graphql-data-source.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    FormsModule,
    CommonModule,
    GraphQlDataSourceModule,
    ExampleDashModule,
    DashboardCoreModule,
    DashboardEditorModule
  ]
})
export class AppComponent {
  public readonly title: string = 'hyperdash-angular';
}
