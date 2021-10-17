import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopLocationPage } from './shop-location.page';

const routes: Routes = [
  {
    path: '',
    component: ShopLocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopLocationPageRoutingModule {}
