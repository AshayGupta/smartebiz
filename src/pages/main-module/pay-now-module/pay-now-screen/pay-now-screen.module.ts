import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PayNowScreenPage } from './pay-now-screen';
import { GetPremiumDueService } from '../../../../providers/services/main-module-services/pay-now-module-services/get-premium-due.service';
import { PaynowSummaryPageModule } from '../pay-now-summary/pay-now-summary.module';
import { ComponentsModule } from '../../../../common/components/components.module';

@NgModule({
  declarations: [
    PayNowScreenPage,
  ],
  imports: [
    IonicPageModule.forChild(PayNowScreenPage),
    ComponentsModule,
    PaynowSummaryPageModule
  ],
  providers: [
    GetPremiumDueService
  ]
})
export class PayNowScreenPageModule {}
