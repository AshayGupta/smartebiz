import { ServiceRequestsListPage } from './../../../service-request-module/service-requests-list/service-requests-list';
import { MakePaymentReq, MakePaymentResp } from './../../../../../dataModels/make-payment.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-thank-you-topup',
  templateUrl: 'thank-you-topup.html',
})
export class ThankYouTopupPage {

  headerTitle: string = "Thank You";
  paymentReq: MakePaymentReq = new MakePaymentReq();
  transactionDate: Date = new Date();
  paymentResp:MakePaymentResp=new MakePaymentResp();

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ThankYouTopupPage');
    this.paymentReq=this.navParams.get('paymentReq');
    this.paymentResp=this.navParams.get('paymentResp');
    console.log('ThankYouTopupPage paymentReq ->',this.paymentReq);
  }
  
  okClicked() {
    this.navCtrl.push(ServiceRequestsListPage).then(() => {
      this.navCtrl.remove(1, this.navCtrl.getActive().index - 1);
    });
  }

}
