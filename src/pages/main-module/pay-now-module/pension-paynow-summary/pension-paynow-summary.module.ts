import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PensionPaynowSummaryPage } from './pension-paynow-summary';
import { ComponentsModule } from '../../../../common/components/components.module';
import { PayNowPaymentPageModule } from '../pay-now-payment/pay-now-payment.module';

@NgModule({
  declarations: [
    PensionPaynowSummaryPage,
  ],
  imports: [
    IonicPageModule.forChild(PensionPaynowSummaryPage),
    PayNowPaymentPageModule, 
    ComponentsModule
  ],
})
export class PensionPaynowSummaryPageModule {}
