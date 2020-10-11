import { MakePaymentReq, MakePaymentResp } from './../../../../dataModels/make-payment.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-pension-paynow-thankyou',
  templateUrl: 'pension-paynow-thankyou.html',
})
export class PensionPaynowThankyouPage {

  headerTitle: string = "Thank You";
  paymentReq: MakePaymentReq = new MakePaymentReq();
  transactionDate: Date = new Date();
  paymentResp: MakePaymentResp = new MakePaymentResp();


  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PensionPaynowThankyouPage');

    this.paymentReq = this.navParams.get('paymentReq');
    this.paymentResp = this.navParams.get('paymentResp');

    console.log('ThankYouPensionPayNowPage paymentReq ->', this.paymentReq);
  }

}
