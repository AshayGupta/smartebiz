import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FundsPaymentMethodPage } from './funds-payment-method';
import { ComponentsModule } from '../../../../../common/components/components.module';
import { VerifyTransactionFundsPageModule } from '../verify-transaction-funds/verify-transaction-funds.module';
import { PaymentMethodPageModule } from '../../../../common-pages/payment/payment-method/payment-method.module';

@NgModule({
  declarations: [
    FundsPaymentMethodPage,
  ],
  imports: [
    IonicPageModule.forChild(FundsPaymentMethodPage),
    ComponentsModule,
    VerifyTransactionFundsPageModule,
    PaymentMethodPageModule
  ],
})
export class FundsPaymentMethodPageModule {}
