import { ComponentsModule } from './../../../../common/components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PayNowFinalSummaryPage } from './pay-now-final-summary';

@NgModule({
  declarations: [
    PayNowFinalSummaryPage,
  ],
  imports: [
    IonicPageModule.forChild(PayNowFinalSummaryPage),
    ComponentsModule
  ],
})
export class PayNowFinalSummaryPageModule {}
