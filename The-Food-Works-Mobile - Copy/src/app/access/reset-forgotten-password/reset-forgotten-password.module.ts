import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResetForgottenPasswordPageRoutingModule } from './reset-forgotten-password-routing.module';

import { ResetForgottenPasswordPage } from './reset-forgotten-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResetForgottenPasswordPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ResetForgottenPasswordPage]
})
export class ResetForgottenPasswordPageModule {}
