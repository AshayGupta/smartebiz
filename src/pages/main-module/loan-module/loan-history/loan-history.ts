import { LoanHistory } from './../../../../dataModels/loan-history.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoanHistoryListService } from './../../../../providers/services/main-module-services/loan-module-services/loan-history.service';
import { LogonService } from './../../../../providers/services/auth/logon.service';
import { LoanHistoryReq, LoanHistoryResp } from '../../../../dataModels/loan-history.model';
import { CustomFirebaseAnalyticsProvider } from '../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../../common/decorators/page-track';
import { ClientDetailsStorageKey } from '../../../../common/enums/enums';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-loan-history',
  templateUrl: 'loan-history.html',
})
export class LoanHistoryPage {

  loanHistoryList: LoanHistory[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public logonService: LogonService,
    public loanHistoryListService: LoanHistoryListService,private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoanHistoryPage');
    this.getLoanHistory();

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('LoanHistoryPage');  

  }

  getLoanHistory() {
    let req = new LoanHistoryReq();
    req.personNumber = localStorage.getItem(ClientDetailsStorageKey.PersonNo);
    req.collection = 'cp_loan';

    this.loanHistoryListService.getLoanHistoryList(req, (resp: LoanHistoryResp) => {
      this.loanHistoryList = resp.loanHistoryList;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getLoanHistory();
          }
        })
      });
  }

}
