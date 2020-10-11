import { BankAccountsService } from '../../../../providers/services/main-module-services/bank-module-services/get-bank-accounts.service';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoanPayoutPage } from './loan-payout';
import { RemoveQuoteService } from '../../../../providers/services/main-module-services/loan-module-services/remove-quote.service';
import { GenerateLoanQuoteService } from '../../../../providers/services/main-module-services/loan-module-services/generate-loan-quote.service';
import { ComponentsModule } from '../../../../common/components/components.module';

@NgModule({
  declarations: [
    LoanPayoutPage,
  ],
  imports: [
    IonicPageModule.forChild(LoanPayoutPage),
    ComponentsModule
  ],
  providers: [
    BankAccountsService,
    RemoveQuoteService,
    GenerateLoanQuoteService
  ]
})
export class LoanPayoutPageModule {}
