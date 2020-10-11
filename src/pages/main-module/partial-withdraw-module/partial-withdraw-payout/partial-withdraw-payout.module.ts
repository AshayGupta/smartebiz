import { BankAccountsService } from '../../../../providers/services/main-module-services/bank-module-services/get-bank-accounts.service';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartialWithdrawPayoutPage } from './partial-withdraw-payout';
import { ComponentsModule } from '../../../../common/components/components.module';

@NgModule({
  declarations: [ 
    PartialWithdrawPayoutPage,
  ],
  imports: [
    IonicPageModule.forChild(PartialWithdrawPayoutPage),
    ComponentsModule
  ],
  providers: [ 
    BankAccountsService,
  ]
})
export class PartialWithdrawPayoutPageModule {}
