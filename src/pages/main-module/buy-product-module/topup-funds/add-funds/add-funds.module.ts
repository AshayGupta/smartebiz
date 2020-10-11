import { HtmlContentService } from './../../../../../providers/services/common-pages/html-content.service';
import { TopUpTncModalPageModule } from './../top-up-tnc-modal/top-up-tnc-modal.module';
import { GetTransactionNumberService } from './../../../../../providers/services/main-module-services/buy-product-module-services/get-transaction-number.service';
import { AmcMongoStagesService } from './../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';
import { TopupPaymentMethodPageModule } from './../topup-payment-method/topup-payment-method.module';
import { ComponentsModule } from './../../../../../common/components/components.module';
import { PaymentMethodPageModule } from '../../../../common-pages/payment/payment-method/payment-method.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddFundsPage } from './add-funds';

@NgModule({
  declarations: [
    AddFundsPage
  ],
  imports: [
    IonicPageModule.forChild(AddFundsPage),
    PaymentMethodPageModule,
    TopupPaymentMethodPageModule,
    TopUpTncModalPageModule,
    ComponentsModule
  ],
  providers:[AmcMongoStagesService,
    GetTransactionNumberService,HtmlContentService
  ]
})
export class AddFundsPageModule {}
