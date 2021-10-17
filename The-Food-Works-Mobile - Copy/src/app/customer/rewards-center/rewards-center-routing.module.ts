import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RewardsCenterPage } from './rewards-center.page';

const routes: Routes = [
  {
    path: '',
    component: RewardsCenterPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class RewardsCenterPageRoutingModule {}
