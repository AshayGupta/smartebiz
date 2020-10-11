import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerifyPaymentModalPage } from './verify-payment-modal';

@NgModule({
  declarations: [
    VerifyPaymentModalPage,
  ],
  imports: [
    IonicPageModule.forChild(VerifyPaymentModalPage),
  ],
  exports: [
    VerifyPaymentModalPage
  ]
})
export class VerifyPaymentModalPageModule {}
