import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { IOrder } from 'src/app/interfaces/orders';
import { AccessService } from 'src/app/services/access.service';
import { CustomerService } from 'src/app/services/customer.service';
import { ProductReviewPage } from '../modals/product-review/product-review.page';
import { QrCodePage } from '../modals/qr-code/qr-code.page';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.page.html',
  styleUrls: ['./view-order.page.scss'],
})
export class ViewOrderPage implements OnInit {

  order: IOrder;
  orderID: any;
  customerID: any;
  orderTotal: number;
  vatPercentage: number;
  vatAmount: number;
  canViewQR = false;
  canReview = false;

  constructor(private modal: ModalController, private toast: ToastController,
    private service: CustomerService, private accessService: AccessService) {}

  ngOnInit() {

    this.vatPercentage = this.service.vatPercentage;

    this.service.getOrder().subscribe((data: any) => {
      this.order = data;
      if(data.orderStatus === 4) {
        this.canViewQR = true;
      } else if (data.orderStatus === 3) {
        this.canReview = true;
      }
      this.orderTotal = 0;
      this.vatAmount = 0;
      this.order.orderLines.forEach(element => {
        const productTotal = (element.productPrice * element.quantity);
        this.orderTotal += productTotal;
        this.vatAmount += (productTotal * (this.vatPercentage / 100));
      });
      if (this.order.completionMethod === 'Delivery') {
        this.orderTotal += 30;
      }
    });

    this.accessService.userID.pipe(take(1)).subscribe(userID => {
      if (!userID) {
        throw new Error('No used ID found!');
      }
      this.customerID = userID;
    });
  }

  async presentQRModal(orderID: any) {
    const modal = await this.modal.create({
      component: QrCodePage,
      swipeToClose: true,
      componentProps: {
        orderNumber: orderID,
        customerID: this.customerID
      }
    });
    return await modal.present();
  }

  async presentReviewModal(productID: any) {
    this.service.setProductID(productID);
    const modal = await this.modal.create({
      component: ProductReviewPage,
      swipeToClose: true
    });
    modal.onDidDismiss().then((formData: any) => {
      if (formData.data) {
        this.service.doReview(formData.data).subscribe(res => {
          this.presentSuccessToast();
        }, error => {
          this.presentFailToast();
        });
      }
    });
    return await modal.present();
  }

  async presentSuccessToast() {
    const toast = await this.toast.create({
      header: 'Success!',
      message: 'Your review was successful.',
      position: 'top',
      color: 'success',
      duration: 2000,
      buttons: [{
          text: 'Close',
          role: 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await toast.present();
  }

  async presentFailToast() {
    const toast = await this.toast.create({
      header: 'Oops!',
      message: 'Something went wrong.',
      position: 'top',
      color: 'danger',
      duration: 2000,
      buttons: [{
          text: 'Close',
          role: 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await toast.present();
  }
}
