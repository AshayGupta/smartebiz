import { PendingOrdersService } from './../../../../../providers/services/main-module-services/buy-product-module-services/get-pending-oders.service';
import { AmcMongoStagesService } from './../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';
import { GetTransactionNumberService } from './../../../../../providers/services/main-module-services/buy-product-module-services/get-transaction-number.service';
import { WithdrawPayoutPageModule } from './../withdraw-payout/withdraw-payout.module';
import { ComponentsModule } from './../../../../../common/components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WithdrawPage } from './withdraw';

@NgModule({
  declarations: [
    WithdrawPage,
  ],
  imports: [
    IonicPageModule.forChild(WithdrawPage),
    ComponentsModule,
    WithdrawPayoutPageModule
  ],
  providers:[GetTransactionNumberService,AmcMongoStagesService,PendingOrdersService]
})
export class WithdrawPageModule {}
