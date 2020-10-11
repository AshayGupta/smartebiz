import { PartialWithdrawHistoryListService } from './../../../../providers/services/main-module-services/partial-withdraw-module-services/partial-withdraw-history.service';
import { PartialWithdrawHistoryPage } from './partial-withdraw-history';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../../../common/components/components.module';

@NgModule({
  declarations: [
    PartialWithdrawHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(PartialWithdrawHistoryPage),
    ComponentsModule
  ],
  providers: [
    PartialWithdrawHistoryListService
  ]
})
export class PartialWithdrawHistoryPageModule {}
