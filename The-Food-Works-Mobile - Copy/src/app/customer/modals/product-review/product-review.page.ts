import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-product-review',
  templateUrl: './product-review.page.html',
  styleUrls: ['./product-review.page.scss'],
})
export class ProductReviewPage implements OnInit {

  reviewForm: FormGroup;
  rate: any;

  constructor(private modal: ModalController, private fb: FormBuilder, private alert: AlertController) { }
  ngOnInit() {
    this.reviewForm = this.fb.group({
      feedback: ['', [
        Validators.required,
      ]],
      rating: ['', [
        Validators.required,
      ]],
    });
  }

  async presentAlert() {
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'Review Confirmation',
      message: 'Are you sure you want to submit your review of this product?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Confirm',
          handler: () => {
            console.log(this.reviewForm.value);
            this.dismissModal(this.reviewForm.value);
          }
        }
      ]
    });

    await alert.present();
  }

  dismissModal(formData: any): void {
    this.modal.dismiss(formData);
  }
}
