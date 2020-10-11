import { AccountDetailsPageModule } from './../../account-details/account-details.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LifeDetailsPage } from './life-details';
import { LifeAccountDetailsService } from '../../../../../providers/services/main-module-services/product-services/life-services/life-tabs/life-account-details.service';
import { LifeAccountBonusesService } from '../../../../../providers/services/main-module-services/product-services/life-services/life-tabs/life-account-bonuses.service';
import { LifePremiumDetailsService } from '../../../../../providers/services/main-module-services/product-services/life-services/life-tabs/life-premium-details.service';
import { LifePayoutScheduleService } from '../../../../../providers/services/main-module-services/product-services/life-services/life-tabs/life-payout-schedule.service';
import { LifeAccountRelationsService } from '../../../../../providers/services/main-module-services/product-services/life-services/life-tabs/life-account-relations.service';
import { LifePolicyBenefitsService } from '../../../../../providers/services/main-module-services/product-services/life-services/life-tabs/life-policy-benefits.service';

@NgModule({
  declarations: [
    LifeDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(LifeDetailsPage),
    AccountDetailsPageModule,
  ],
  providers: [
    LifeAccountDetailsService,
    LifeAccountBonusesService,
    LifePremiumDetailsService,
    LifePayoutScheduleService,
    LifeAccountRelationsService,
    LifePolicyBenefitsService
  ]
})
export class LifeDetailsPageModule {}
