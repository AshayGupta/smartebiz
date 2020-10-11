import { AmcMongoStagesService } from './../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';
import { AmcMongoStagesReq } from './../../../../dataModels/amc-mongo-stages.model';
import { LocalStorageKey, MongoAMCStaging } from './../../../../common/enums/enums';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Modal } from 'ionic-angular';
import { MakePaymentReq, PaymentList } from '../../../../dataModels/make-payment.model';
import { PayNowPaymentSummaryPage } from '../pay-now-payment-summary/pay-now-payment-summary';
import { CustomFirebaseAnalyticsProvider } from '../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../../common/decorators/page-track';
import { AlertService } from '../../../../providers/plugin-services/alert.service';


@PageTrack()
@IonicPage()
@Component({
  selector: 'page-pay-now-payment',
  templateUrl: 'pay-now-payment.html',
})
export class PayNowPaymentPage {

  headerTitle: string = 'Pay Now';
  paymentReq = new MakePaymentReq();
  paymentList = new PaymentList();
  paymentOption: any;
  isenabled: boolean;
  className: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider,
    private amcMongoStagesService: AmcMongoStagesService,
    private alertService: AlertService
  ) {
    this.paymentReq = this.navParams.get('paymentReq');
    this.paymentList = this.navParams.get('paymentList');

    console.log('pay-now-payment paymentReq', this.paymentReq);
  }

  ionViewDidLoad() {
    console.log('3', this.navCtrl);
    console.log('ionViewDidLoad PayNowPaymentPage');

    this.selectPaymentoption('mpesa');

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('PayNowPaymentPage');
  }

  click() {
    console.log('payment data');
  }

  selectPaymentoption(value: any) {
    console.log('payment event', value);
    this.paymentOption = value;

    if (value == 'mpesa') {
      this.isenabled = true;
      this.className = 'payment-card active';
    } else {
      this.isenabled = false;
      this.className = 'payment-card';
    }
  }

  goToLoanHistory() {
  }

  paySummary() {
    console.log('selectedOption', this.paymentOption);

    if (localStorage.getItem(LocalStorageKey.PageFlow) == "PensionPayNow") {
      this.updateMongoStages();
    }

    if (this.paymentOption == 'mpesa' && parseFloat(this.paymentReq.amount) > 70000) {
      let msg = "Sorry! you can't pay more than KSH 70000 at a go!!. Please edit the amount or contact Britam customer care";
      this.alertService.Alert.alert(msg)
    }
    else {
      this.presentPaynowModal();
    }
   
  }

  presentPaynowModal() {
    let options = {
      showBackdrop: true,
      enableBackdropDismiss: true,
    };

    let paynowModal: Modal = this.modalCtrl.create(PayNowPaymentSummaryPage, { 
      'paymentReq': this.paymentReq, 
      'paymentOption': this.paymentOption, 
      'paymentList': this.paymentList, 
      'nav': this.navCtrl, 
      'amcMongoReq': this.navParams.get("amcMongoReq") 
    }, options);

    paynowModal.present();
  }


  viewPaymentDetails() {
    this.navCtrl.getPrevious().name;
  }

  updateMongoStages() {
    let amcMongoReq: AmcMongoStagesReq = this.navParams.get("amcMongoReq");
    
    amcMongoReq.cp_pension_makecontribution["stages"].filter(item => {
      if (item.name == "MPesa") {
        item.status = MongoAMCStaging.Done;
      }
    });
    
    this.amcMongoStagesService.updateAmcMongoStage(amcMongoReq, (resp) => {
    })
  }

}
