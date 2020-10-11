import { VerifyTransactionTopupPageModule } from './../verify-transaction-topup/verify-transaction-topup.module';
import { ComponentsModule } from './../../../../../common/components/components.module';
import { PaymentMethodPageModule } from './../../../../common-pages/payment/payment-method/payment-method.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TopupPaymentMethodPage } from './topup-payment-method';

@NgModule({
  declarations: [
    TopupPaymentMethodPage,
  ],
  imports: [
    IonicPageModule.forChild(TopupPaymentMethodPage),
    PaymentMethodPageModule,
    VerifyTransactionTopupPageModule,
    ComponentsModule,
  ],
})
export class TopupPaymentMethodPageModule {}
