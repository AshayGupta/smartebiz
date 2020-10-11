import { AmcMongoStagesReq } from './../../../../dataModels/amc-mongo-stages.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { MakePaymentReq, PaymentList } from '../../../../dataModels/make-payment.model';
import { PayNowPaymentPage } from '../pay-now-payment/pay-now-payment';
import { ImgsPath } from '../../../../common/constants/constants';
import { CustomFirebaseAnalyticsProvider } from '../../../../providers/custom-firebase-analytics/custom-firebase-analytics';


@IonicPage()
@Component({
  selector: 'page-pension-paynow-summary',
  templateUrl: 'pension-paynow-summary.html',
})
export class PensionPaynowSummaryPage {

  paymentReq = new MakePaymentReq();
  paymentList: PaymentList[] = [];
  paymentOption: string;
  headerImg: string = ImgsPath.britamLogo;

  constructor(public navCtrl: NavController,
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
    console.log('ionViewDidLoad PensionPaynowSummaryPage');

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('PensionPaynowSummaryPage');
  }


  cancel() {
    this.viewCtrl.dismiss();
  }

  paySummaryClicked() {
    this.navCtrl.push(PayNowPaymentPage, {
      'paymentReq': this.paymentReq,
      'paymentOption': this.paymentOption,
      'amcMongoReq': this.navParams.get("amcMongoReq")
    });
  }



}
