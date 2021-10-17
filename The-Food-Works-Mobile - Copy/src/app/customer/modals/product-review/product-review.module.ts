import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductReviewPageRoutingModule } from './product-review-routing.module';

import { ProductReviewPage } from './product-review.page';
import { BarRatingModule } from 'ngx-bar-rating';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductReviewPageRoutingModule,
    ReactiveFormsModule,
    BarRatingModule
  ],
  declarations: [ProductReviewPage]
})
export class ProductReviewPageModule {}
