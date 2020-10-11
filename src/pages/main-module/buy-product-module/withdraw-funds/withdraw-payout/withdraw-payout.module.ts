import { WithdrawVerifyPageModule } from './../withdraw-verify/withdraw-verify.module';
import { ComponentsModule } from './../../../../../common/components/components.module';
import { BankAccountsService } from './../../../../../providers/services/main-module-services/bank-module-services/get-bank-accounts.service';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WithdrawPayoutPage } from './withdraw-payout';
import { AmcMongoStagesService } from '../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';

@NgModule({
  declarations: [
    WithdrawPayoutPage,
  ],
  imports: [
    IonicPageModule.forChild(WithdrawPayoutPage),
    ComponentsModule,
    WithdrawVerifyPageModule
  ],
  providers:[
    BankAccountsService,
    AmcMongoStagesService
  ]
})
export class WithdrawPayoutPageModule {}
