import { InitialWithdrawVerifyPageModule } from '../initial-withdraw-verify/initial-withdraw-verify.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ApplyInitialwithdrawPage } from './apply-initial-withdraw';
import { AddNewBankPageModule } from '../add-new-bank/add-new-bank.module';
import { ComponentsModule } from '../../../../../../common/components/components.module';
import { GetPensionPartialAmountService } from '../../../../../../providers/services/main-module-services/product-services/pension-services/getPensionPartialAmount.service';
import { AmcMongoStagesService } from '../../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';


@NgModule({
  declarations: [
    ApplyInitialwithdrawPage,
  ],
  imports: [
    IonicPageModule.forChild(ApplyInitialwithdrawPage),
    ComponentsModule,
    InitialWithdrawVerifyPageModule,
    AddNewBankPageModule
  ],
  providers: [
    GetPensionPartialAmountService,
    AmcMongoStagesService
  ]
})
export class ApplyInitialwithdrawPageModule {}
