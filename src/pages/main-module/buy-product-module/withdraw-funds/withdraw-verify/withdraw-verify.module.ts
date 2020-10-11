import { HtmlContentService } from './../../../../../providers/services/common-pages/html-content.service';
import { WithdrawTncModalPageModule } from './../withdraw-tnc-modal/withdraw-tnc-modal.module';
import { TransactionCharges } from './../../../../../providers/services/main-module-services/buy-product-module-services/get-transaction-charges.service';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WithdrawVerifyPage } from './withdraw-verify';
import { ComponentsModule } from '../../../../../common/components/components.module';

@NgModule({
  declarations: [
    WithdrawVerifyPage,
  ],
  imports: [
    IonicPageModule.forChild(WithdrawVerifyPage),
    ComponentsModule,
    WithdrawTncModalPageModule
  ],
  providers:[TransactionCharges,HtmlContentService]
})
export class WithdrawVerifyPageModule {}
