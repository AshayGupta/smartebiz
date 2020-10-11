import { LoanQuoteService } from './../../../../providers/services/main-module-services/loan-module-services/loan-quote.service';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ApplyLoanPage } from './apply-loan';
import { LoanPayoutPageModule } from '../loan-payout/loan-payout.module';
import { VerifyLoanPageModule } from '../verify-loan/verify-loan.module';
import { LoanBalancesService } from '../../../../providers/services/main-module-services/loan-module-services/get-loan-balance.service';
import { LoanHistoryPageModule } from '../loan-history/loan-history.module';
import { ComponentsModule } from '../../../../common/components/components.module';

@NgModule({
  declarations: [
    ApplyLoanPage,
  ],
  imports: [
    IonicPageModule.forChild(ApplyLoanPage),
    ComponentsModule,
    LoanPayoutPageModule,
    VerifyLoanPageModule,
    LoanHistoryPageModule
  ],
  providers: [
    LoanQuoteService,
    LoanBalancesService
  ]
})
export class ApplyLoanPageModule {}
