import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewOrdersPage } from './view-orders.page';

const routes: Routes = [
  {
    path: '',
    component: ViewOrdersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewOrdersPageRoutingModule {}
