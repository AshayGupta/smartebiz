import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewStatementPage } from './view-statement';
import { GetPensionAccountDetailsService } from '../../../../../providers/services/main-module-services/product-services/pension-services/pension-details/get-pension-account-details.service';
import { GetInvestmentIncomeService } from '../../../../../providers/services/main-module-services/product-services/pension-services/pension-details/get-investment-income.service';
import { GetStBenefitPaymentsService } from '../../../../../providers/services/main-module-services/product-services/pension-services/pension-details/get-stBenefit-payments.service';
import { GetStClosingBalanceService } from '../../../../../providers/services/main-module-services/product-services/pension-services/pension-details/get-stClosing-balance.service';
import { GetStContributionsService } from '../../../../../providers/services/main-module-services/product-services/pension-services/pension-details/get-stContributions.service';
import { GetStOpenBalanceService } from '../../../../../providers/services/main-module-services/product-services/pension-services/pension-details/get-stOpen-balance.service';
import { AccountDetailsPageModule } from '../../account-details/account-details.module';
import { ComponentsModule } from '../../../../../common/components/components.module';

@NgModule({
  declarations: [
    ViewStatementPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewStatementPage),
    ComponentsModule
  ],
  providers: [
    GetPensionAccountDetailsService,
    GetInvestmentIncomeService,
    GetStBenefitPaymentsService,
    GetStClosingBalanceService,
    GetStContributionsService,
    GetStOpenBalanceService
  ]
})
export class ViewStatementPageModule {}
