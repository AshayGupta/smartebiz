import { SwitchPageModule } from './../../buy-product-module/switch-funds/switch/switch.module';
import { WithdrawPageModule } from '../../buy-product-module/withdraw-funds/withdraw/withdraw.module';
import { PartialWithdrawPayoutPageModule } from './../../partial-withdraw-module/partial-withdraw-payout/partial-withdraw-payout.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyProductScreenPage } from './my-product-screen';
import { ApplyLoanPageModule } from '../../loan-module/apply-loan/apply-loan.module';
import { ApplyPartialwithdrawPageModule } from '../../partial-withdraw-module/apply-partial-withdraw/apply-partial-withdraw.module';
import { RaiseRequestPageModule } from '../../service-request-module/raise-request/raise-request.module';
import { AddFundsPageModule } from '../../buy-product-module/topup-funds/add-funds/add-funds.module';
import { BeneficiaryDetailsPageModule } from '../pension/beneficiary/beneficiary-details/beneficiary-details.module';
import { ViewStatementPageModule } from '../pension/view-statement/view-statement.module';
import { ApplyInitialwithdrawPageModule } from '../pension/initial-withdraw-module/apply-initial-withdraw/apply-initial-withdraw.module';

@NgModule({
  declarations: [
    MyProductScreenPage,
  ],
  imports: [
    IonicPageModule.forChild(MyProductScreenPage),
    ApplyLoanPageModule,
    ApplyInitialwithdrawPageModule,
    ApplyPartialwithdrawPageModule,
    PartialWithdrawPayoutPageModule,
    RaiseRequestPageModule,
    AddFundsPageModule,
    WithdrawPageModule,
    SwitchPageModule,
    BeneficiaryDetailsPageModule,
    ViewStatementPageModule
  ],
  exports: [
    MyProductScreenPage
  ],
  providers: [
  ]

})
export class MyProductScreenPageModule {}
