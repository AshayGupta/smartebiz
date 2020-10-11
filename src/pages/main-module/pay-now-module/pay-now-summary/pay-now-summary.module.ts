import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaynowSummaryPage } from './pay-now-summary';
import { PayNowPaymentPageModule } from '../pay-now-payment/pay-now-payment.module';
import { ComponentsModule } from '../../../../common/components/components.module';
  
  
@NgModule({
  declarations: [
    PaynowSummaryPage, 
  ],
  imports: [
    IonicPageModule.forChild(PaynowSummaryPage), 
    PayNowPaymentPageModule,
    ComponentsModule
  ],
})
export class PaynowSummaryPageModule {}
