import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InitialWithdrawVerifyPage } from './initial-withdraw-verify';
import { InitialWithdrawTncPageModule } from '../initial-withdraw-tnc/initial-withdraw-tnc.module';
import { ComponentsModule } from '../../../../../../common/components/components.module';
import { ProcessPartialWithdrawalService } from '../../../../../../providers/services/main-module-services/partial-withdraw-module-services/process-partial-withdrawal.service';
import { AmcMongoStagesService } from '../../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';
import { HtmlContentService } from '../../../../../../providers/services/common-pages/html-content.service';
import { GetTransactionNumberService } from '../../../../../../providers/services/main-module-services/buy-product-module-services/get-transaction-number.service';
import { ClientDetailsService } from '../../../../../../providers/services/main-module-services/product-services/client-details.service';

@NgModule({
  declarations: [
    InitialWithdrawVerifyPage,
  ],
  imports: [
    IonicPageModule.forChild(InitialWithdrawVerifyPage),
    ComponentsModule,
    InitialWithdrawTncPageModule
  ],
  providers: [
    ProcessPartialWithdrawalService,
    AmcMongoStagesService,
    HtmlContentService,
    GetTransactionNumberService,
    ClientDetailsService
  ]
})
export class InitialWithdrawVerifyPageModule {}
