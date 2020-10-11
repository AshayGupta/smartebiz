import { AmcMongoStagesService } from './../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PayNowPaymentPage } from './pay-now-payment';
import { PayNowPaymentSummaryPageModule } from '../pay-now-payment-summary/pay-now-payment-summary.module';
import { ComponentsModule } from '../../../../common/components/components.module';

@NgModule({
  declarations: [
    PayNowPaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(PayNowPaymentPage),
    ComponentsModule,
    PayNowPaymentSummaryPageModule
  ],
  providers:[AmcMongoStagesService]
})
export class PayNowPaymentPageModule {}
