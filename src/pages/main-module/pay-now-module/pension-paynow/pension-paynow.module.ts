import { AmcMongoStagesService } from './../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';
import { GetTransactionNumberService } from './../../../../providers/services/main-module-services/buy-product-module-services/get-transaction-number.service';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PensionPaynowPage } from './pension-paynow';
 import { ComponentsModule } from '../../../../common/components/components.module';
import { PensionPaynowSummaryPageModule } from '../pension-paynow-summary/pension-paynow-summary.module';

@NgModule({
  declarations: [
    PensionPaynowPage,
  ],
  imports: [
    IonicPageModule.forChild(PensionPaynowPage),
    ComponentsModule,
    PensionPaynowSummaryPageModule
  ],
  providers:[
    GetTransactionNumberService,
    AmcMongoStagesService
  ]
})
export class PensionPaynowPageModule {}
