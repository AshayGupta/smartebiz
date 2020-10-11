import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MakePaymentReq, PaymentList } from '../../../../dataModels/make-payment.model';
import { ImgsPath } from '../../../../common/constants/constants';
import { CustomFirebaseAnalyticsProvider } from '../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../../common/decorators/page-track';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-pay-now-final-summary',
  templateUrl: 'pay-now-final-summary.html',
})
export class PayNowFinalSummaryPage {

  headerImg: string = ImgsPath.britamLogo;
  paymentReq = new MakePaymentReq();
  paymentList = new PaymentList();
  policyArray: Array<string> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider) {
  
    this.paymentReq = this.navParams.get('paymentReq');
    // this.paymentOption = this.navParams.get('paymentOption'); 
    this.policyArray = this.paymentReq.accountNumber.split(',');
  }

  ionViewDidLoad() {
    console.log('6', this.navCtrl);
    console.log('ionViewDidLoad PayNowFinalSummaryPage'); 

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('PayNowFinalSummaryPage');

  }

  downloadReceipt() {
    console.log('Download receipt');
    this.navCtrl.remove(0, this.navCtrl.getActive().index).then(() => {
      this.navCtrl.pop();
    });
  }


}
