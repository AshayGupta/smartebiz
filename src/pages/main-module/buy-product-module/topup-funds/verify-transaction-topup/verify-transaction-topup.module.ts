import { AmcMongoStagesService } from './../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';
import { PayNowFinalPaymentPageModule } from './../../../pay-now-module/pay-now-final-payment/pay-now-final-payment.module';
import { ComponentsModule } from './../../../../../common/components/components.module';
import { AlertService } from './../../../../../providers/plugin-services/alert.service';
import { VerifyPaymentModalPageModule } from './../../../../common-pages/payment/verify-payment-modal/verify-payment-modal.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerifyTransactionTopupPage } from './verify-transaction-topup';

@NgModule({
  declarations: [
    VerifyTransactionTopupPage,
  ],
  imports: [
    IonicPageModule.forChild(VerifyTransactionTopupPage),
    ComponentsModule,
    VerifyPaymentModalPageModule,
    PayNowFinalPaymentPageModule

  ],
  providers: [
    AlertService,
    AmcMongoStagesService
  ]
})
export class VerifyTransactionTopupPageModule { }
