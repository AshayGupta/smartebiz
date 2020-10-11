import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerifyTransactionFundsPage } from './verify-transaction-funds';
import { ComponentsModule } from '../../../../../common/components/components.module';
import { VerifyPaymentModalPageModule } from '../../../../common-pages/payment/verify-payment-modal/verify-payment-modal.module';
import { PayNowFinalPaymentPageModule } from '../../../pay-now-module/pay-now-final-payment/pay-now-final-payment.module';
import { CreateAccountService } from '../../../../../providers/services/main-module-services/pay-now-module-services/create-account.service';
import { AmcMongoStagesService } from '../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';

@NgModule({
  declarations: [
    VerifyTransactionFundsPage,
  ],
  imports: [
    IonicPageModule.forChild(VerifyTransactionFundsPage),
    ComponentsModule,
    VerifyPaymentModalPageModule,
    PayNowFinalPaymentPageModule
  ],
  providers: [
    CreateAccountService,
    AmcMongoStagesService
  ]
})
export class VerifyTransactionFundsPageModule { }
