import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { UserGuard } from './guards/user.guard';

const routes: Routes = [
  {
    path: '', redirectTo: 'shop-location', pathMatch: 'full'
  },
  {
    path: 'shop-location',
    loadChildren: () => import('./customer/shop-location/shop-location.module').then( m => m.ShopLocationPageModule),
    canActivate: [UserGuard]
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./customer/cart/cart.module').then( m => m.CartPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./access/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./access/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./access/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'checkout',
    loadChildren: () => import('./customer/checkout/checkout.module').then( m => m.CheckoutPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'view-orders',
    loadChildren: () => import('./customer/view-orders/view-orders.module').then( m => m.ViewOrdersPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'view-order',
    loadChildren: () => import('./customer/view-order/view-order.module').then( m => m.ViewOrderPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'view-product',
    loadChildren: () => import('./customer/view-product/view-product.module').then( m => m.ViewProductPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'add-to-cart',
    loadChildren: () => import('./customer/modals/add-to-cart/add-to-cart.module').then( m => m.AddToCartPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'qr-code',
    loadChildren: () => import('./customer/modals/qr-code/qr-code.module').then( m => m.QrCodePageModule)
  },
  {
    path: 'rewards',
    loadChildren: () => import('./customer/rewards/rewards.module').then( m => m.RewardsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'logged-out',
    loadChildren: () => import('./access/logged-out/logged-out.module').then( m => m.LoggedOutPageModule)
  },
  {
    path: 'complete-delivery',
    loadChildren: () => import('./driver/complete-delivery/complete-delivery.module').then( m => m.CompleteDeliveryPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'rewards-center',
    loadChildren: () => import('./customer/rewards-center/rewards-center.module').then( m => m.RewardsCenterPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'loyalty-information',
    loadChildren: () => import('./customer/modals/loyalty-information/loyalty-information.module')
    .then( m => m.LoyaltyInformationPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'vouchers',
    loadChildren: () => import('./customer/vouchers/vouchers.module').then( m => m.VouchersPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'view-voucher',
    loadChildren: () => import('./customer/modals/view-voucher/view-voucher.module').then( m => m.ViewVoucherPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'voucher-qr-code',
    loadChildren: () => import('./customer/modals/voucher-qr-code/voucher-qr-code.module').then( m => m.VoucherQrCodePageModule)
  },
  {
    path: 'eligible-vouchers',
    loadChildren: () => import('./customer/modals/eligible-vouchers/eligible-vouchers.module').then( m => m.EligibleVouchersPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'rewards',
    loadChildren: () => import('./customer/rewards/rewards.module').then( m => m.RewardsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'thank-you',
    loadChildren: () => import('./customer/thank-you/thank-you.module').then( m => m.ThankYouPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'product-review',
    loadChildren: () => import('./customer/modals/product-review/product-review.module').then( m => m.ProductReviewPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'driver-home',
    loadChildren: () => import('./driver/driver-home/driver-home.module').then( m => m.DriverHomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'driver-map',
    loadChildren: () => import('./driver/driver-map/driver-map.module').then( m => m.DriverMapPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'complete-delivery',
    loadChildren: () => import('./driver/complete-delivery/complete-delivery.module').then( m => m.CompleteDeliveryPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'one-time-pin',
    loadChildren: () => import('./access/one-time-pin/one-time-pin.module').then( m => m.OneTimePinPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./access/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'update-customer',
    loadChildren: () => import('./customer/update-customer/update-customer.module').then( m => m.UpdateCustomerPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'reset-forgotten-password',
    loadChildren: () => import('./access/reset-forgotten-password/reset-forgotten-password.module')
      .then( m => m.ResetForgottenPasswordPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
