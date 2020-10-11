import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PayNowPaymentSummaryPage } from './pay-now-payment-summary';
import { PayNowFinalPaymentPageModule } from '../pay-now-final-payment/pay-now-final-payment.module';

@NgModule({
  declarations: [
    PayNowPaymentSummaryPage,
  ],
  imports: [
    IonicPageModule.forChild(PayNowPaymentSummaryPage),
    PayNowFinalPaymentPageModule  
  ],
})
export class PayNowPaymentSummaryPageModule {}
