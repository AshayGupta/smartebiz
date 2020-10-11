import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertService } from './../../../../providers/plugin-services/alert.service';
import { OtpPage, OtpScreenData } from '../../../auth-pages/otp/otp';
import { SignupReq } from '../../../../dataModels/signup.model';
import { LocalStorageKey, PageName } from '../../../../common/enums/enums';
import { AdvanceQuoteReq } from './../../../../dataModels/advance-quote.model';
import { BankPayoutValue } from '../loan-payout/loan-payout';
import { CustomFirebaseAnalyticsProvider } from '../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../../common/decorators/page-track';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-verify-loan',
  templateUrl: 'verify-loan.html',
})
export class VerifyLoanPage {

  headerTitle: string = 'Apply Loan';
  loanHistoryIcon: string = 'assets/imgs/Inbox.png';
  advanceQuoteReq: AdvanceQuoteReq = new AdvanceQuoteReq();
  otpData: OtpScreenData = new OtpScreenData();

  get bankPayoutTag() { return BankPayoutValue; }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertService: AlertService,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider
  ) {
    this.advanceQuoteReq = this.navParams.get('advanceQuoteData');
    this.setupPage();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerifyLoanPage');

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('VerifyLoanPage');

  }

  setupPage() {
    this.otpData.navigateFromPage = PageName.VerifyLoanPage;
    this.otpData.title = 'Apply Loan'
    this.otpData.subTitle = 'Product : ' + this.advanceQuoteReq.policyName + ' - ' + this.advanceQuoteReq.policyNo;
  }

  proceedClicked() {
    let signupReq = new SignupReq();
    signupReq.idOptionKey = 'nationalId';
    signupReq.idValue = localStorage.getItem(LocalStorageKey.NationalID);

    this.navCtrl.push(OtpPage, { 'signupData': signupReq, 'advanceQuote': this.advanceQuoteReq, 'otpData': this.otpData });
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
}
