import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductReviewPage } from './product-review.page';

const routes: Routes = [
  {
    path: '',
    component: ProductReviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductReviewPageRoutingModule {}
