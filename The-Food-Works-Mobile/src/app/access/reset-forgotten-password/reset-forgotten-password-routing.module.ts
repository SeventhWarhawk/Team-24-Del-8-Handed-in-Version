import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResetForgottenPasswordPage } from './reset-forgotten-password.page';

const routes: Routes = [
  {
    path: '',
    component: ResetForgottenPasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResetForgottenPasswordPageRoutingModule {}
