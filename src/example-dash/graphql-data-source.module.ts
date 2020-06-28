import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { DashboardCoreModule } from '@hypertrace/hyperdash-angular';
import { GraphQlDataSource } from './graphql-data-source';

@NgModule({
  imports: [
    HttpClientModule,
    DashboardCoreModule.with({
      models: [GraphQlDataSource]
    })
  ]
})
export class GraphQlDataSourceModule {}
