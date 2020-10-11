import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertService } from '../../../../providers/plugin-services/alert.service';
import { ProcessPartialWithdrawalReq, ProcessPartialWithdrawalResp } from './../../../../dataModels/process-partial-withdraw.model';
import { SignupReq } from '../../../../dataModels/signup.model';
import { LocalStorageKey, PageName } from '../../../../common/enums/enums';
import { OtpPage, OtpScreenData } from '../../../auth-pages/otp/otp';
import { ProcessPartialWithdrawalService } from '../../../../providers/services/main-module-services/partial-withdraw-module-services/process-partial-withdrawal.service';
import { LogonService } from './../../../../providers/services/auth/logon.service';
import { PartialWithdrawHistoryPage } from '../partial-withdraw-history/partial-withdraw-history';
import { CustomFirebaseAnalyticsProvider } from '../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../../common/decorators/page-track';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-partial-withdraw-verify',
  templateUrl: 'partial-withdraw-verify.html',
})
export class PartialWithdrawVerifyPage {

  headerTitle: string = 'Withdrawal Request';
  partialHistoryIcon: string = 'assets/imgs/Inbox.png';
  processPartialWithdrawalReq = new ProcessPartialWithdrawalReq();
  otpData: OtpScreenData = new OtpScreenData();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertService: AlertService,
    public logonService: LogonService,
    public processPartialWithdrawalService: ProcessPartialWithdrawalService,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider
  ) {
    this.processPartialWithdrawalReq = this.navParams.get('processPartialWithdrawalReq');
    this.setupPage();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PartialWithdrawVerifyPage');
    this.processPartialWithdrawal();

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('PartialWithdrawVerifyPage');  

  }

  setupPage() {
    this.otpData.navigateFromPage = PageName.PartialWithdrawVerifyPage;
    this.otpData.title = 'Withdrawal Request';
    this.otpData.subTitle = this.otpData.subTitle = 'Product : ' + this.processPartialWithdrawalReq.policyName + ' - ' + this.processPartialWithdrawalReq.policyNo;
  }

  processPartialWithdrawal() {
    this.processPartialWithdrawalReq.process = 'V';

    this.processPartialWithdrawalService.getProcessPartialWithdrawal(this.processPartialWithdrawalReq, (resp: ProcessPartialWithdrawalResp) => {
      this.processPartialWithdrawalReq.surrenderFee = resp.surrenderFee;
      this.processPartialWithdrawalReq.totalSellCharge = resp.totalSellCharge;
      this.processPartialWithdrawalReq.exciseDuty = resp.exciseDuty;
      this.processPartialWithdrawalReq.surrAdminChg = resp.surrAdminChg;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.processPartialWithdrawal();
          }
        })
      });
  }

  proceedClicked() {
    let signupReq = new SignupReq();
    signupReq.idOptionKey = 'nationalId';
    signupReq.idValue = localStorage.getItem(LocalStorageKey.NationalID);

    this.navCtrl.push(OtpPage, { 'signupData': signupReq, 'processPartialWithdrawalData': this.processPartialWithdrawalReq, 'otpData': this.otpData });
  }

  editClicked() {
    this.navCtrl.popTo(this.navCtrl.getByIndex(1));
  }

  deleteClicked() {
    let deleteMsg: string = "Do you really want to delete?";
    let titleMsg: string = "You are almost done!";
    let successBtn: string = "YES";
    let failureBtn: string = "NO";

    this.alertService.Alert.confirm(deleteMsg, titleMsg, failureBtn, successBtn).then(res => {
      this.navCtrl.popTo(this.navCtrl.first());
    },
      error => {

      });
  }

  goToWithdrawHistory() {
    this.navCtrl.push(PartialWithdrawHistoryPage);
  }

}
