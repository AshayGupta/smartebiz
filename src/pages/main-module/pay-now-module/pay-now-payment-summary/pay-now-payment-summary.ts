import { LocalStorageKey } from './../../../../common/enums/enums';
import { AmcMongoStagesReq } from './../../../../dataModels/amc-mongo-stages.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { MakePaymentReq, PaymentList } from '../../../../dataModels/make-payment.model';
import { PayNowFinalPaymentPage } from '../pay-now-final-payment/pay-now-final-payment';
import { CustomFirebaseAnalyticsProvider } from '../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../../common/decorators/page-track';


@PageTrack()
@IonicPage()
@Component({
  selector: 'page-pay-now-payment-summary',
  templateUrl: 'pay-now-payment-summary.html',
})
export class PayNowPaymentSummaryPage {

  paymentReq = new MakePaymentReq();
  paymentOption: any;
  paymentList = new PaymentList();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider
  ) {
    this.paymentReq = this.navParams.get('paymentReq');
    this.paymentOption = this.navParams.get('paymentOption');
    this.paymentList = this.navParams.get('paymentList');
    // this.navCtrl = this.navParams.get('nav');

    console.log('final paymentReq', this.paymentReq);
    console.log('final paymentOption', this.paymentOption);
  }

  ionViewDidLoad() {
    console.log('4', this.navCtrl);
    console.log('ionViewDidLoad PayNowPaymentSummaryPage');

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('PayNowPaymentSummaryPage');
  }

  paynowPaymentTransaction() {
    this.presentPaynowModal();
  }

  presentPaynowModal() {
    let options = {
      showBackdrop: true,
      enableBackdropDismiss: true,
    };

    let paynowModal = this.modalCtrl.create(PayNowFinalPaymentPage, {
      'paymentReq': this.paymentReq,
      'paymentOption': this.paymentOption,
      'paymentList': this.paymentList,
      'nav': this.navParams.get('nav'),
      'amcMongoReq': this.navParams.get("amcMongoReq")
    }, options);

    paynowModal.present();
  }

  cancel() {
    this.viewCtrl.dismiss();
  }



}
