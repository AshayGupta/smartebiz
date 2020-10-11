import { VerifyFundsPageModule } from './../verify-funds/verify-funds.module';
import { ComponentsModule } from './../../../../../common/components/components.module';
import { InvestmentAmountPage } from './investment-amount';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AmcMongoStagesService } from '../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';

@NgModule({
  declarations: [
    InvestmentAmountPage
  ],
  imports: [
    IonicPageModule.forChild(InvestmentAmountPage),
    ComponentsModule,
    VerifyFundsPageModule,
  ],
  providers: [
    AmcMongoStagesService
  ]
})
export class InvestmentAmountPageModule { }
