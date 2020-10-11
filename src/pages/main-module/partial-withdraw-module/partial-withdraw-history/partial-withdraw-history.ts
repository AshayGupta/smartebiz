import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PartialWithdrawHistoryListService } from './../../../../providers/services/main-module-services/partial-withdraw-module-services/partial-withdraw-history.service';
import { LogonService } from './../../../../providers/services/auth/logon.service';
import { PartialWithdrawHistoryResp, PartialWithdrawHistoryReq, PartialWithdrawHistory } from '../../../../dataModels/partial-withdraw-history.model';
import { CustomFirebaseAnalyticsProvider } from '../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../../common/decorators/page-track';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-partial-withdraw-history',
  templateUrl: 'partial-withdraw-history.html',
})
export class PartialWithdrawHistoryPage {

  partialWithdrawHistoryList: PartialWithdrawHistory[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public logonService: LogonService,
    public partialWithdrawHistoryListService: PartialWithdrawHistoryListService,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PartialWithdrawHistoryPage');
    this.getPartialWithdrawHistory();

     // Firebase Analytics 'screen_view' event tracking
     this.customFirebaseAnalytics.trackView('PartialWithdrawHistoryPage'); 


  }

  getPartialWithdrawHistory() {
    let req = new PartialWithdrawHistoryReq();
    req.policyNo = '163-4630';  //localStorage.getItem(ClientDetailsStorageKey.PersonNo);
    req.collection = 'cp_pw';

    this.partialWithdrawHistoryListService.getPartialWithdrawHistoryList(req, (resp: PartialWithdrawHistoryResp) => {
      this.partialWithdrawHistoryList = resp.partialWithdrawHistoryList;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getPartialWithdrawHistory();
          }
        })
      });
  }

}
