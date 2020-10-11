import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { MakePaymentReq, PaymentList } from '../../../../dataModels/make-payment.model';
import { PayNowPaymentPage } from '../pay-now-payment/pay-now-payment';
import { ImgsPath } from '../../../../common/constants/constants';
import { CustomFirebaseAnalyticsProvider } from '../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../../common/decorators/page-track';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-pay-now-summary',
  templateUrl: 'pay-now-summary.html',
})
export class PaynowSummaryPage {

  paymentReq = new MakePaymentReq();
  paymentList: PaymentList[] = [];
  paymentOption: string;
  headerImg: string = ImgsPath.britamLogo;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, 
    public viewCtrl: ViewController,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider
  ) {
    this.paymentList = this.navParams.get('paymentList');
    this.paymentReq = this.navParams.get('paymentReq');

    console.log(`paymentList`, this.paymentList);

    if (this.navParams.get('paymentOption') == 'mpesa') {
      this.paymentOption = 'M-Pesa';
    } else {
      this.paymentOption = 'Credit Card';
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaynowSummaryPage');
    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('PaynowSummaryPage');

    // (parseFloat(item.editLoanAmount) > parseFloat(item.loanAmount) ? parseFloat(item.loanAmount) : parseFloat(item.editLoanAmount));
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  paySummaryClicked() {
    this.navCtrl.push(PayNowPaymentPage, { 'paymentReq': this.paymentReq, 'paymentOption': this.paymentOption });
  }


  goToLoanHistory() {

  }



}
