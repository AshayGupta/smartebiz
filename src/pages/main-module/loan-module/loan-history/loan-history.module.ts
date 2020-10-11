import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoanHistoryPage } from './loan-history';
import { LoanHistoryListService } from '../../../../providers/services/main-module-services/loan-module-services/loan-history.service';

@NgModule({
  declarations: [
    LoanHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(LoanHistoryPage),
  ],
  providers: [
    LoanHistoryListService
  ]
})
export class LoanHistoryPageModule {}
