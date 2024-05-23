import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { DashboardCoreModule } from '@hypertrace/hyperdash-angular';
import { GraphQlDataSource } from './graphql-data-source';

@NgModule({
  imports: [
    DashboardCoreModule.with({
      models: [GraphQlDataSource]
    })
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class GraphQlDataSourceModule {}
