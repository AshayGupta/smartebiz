import { VerifyTransactionTopupPage } from './../verify-transaction-topup/verify-transaction-topup';
import { TopUpReq } from './../../../../../dataModels/top-up.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Modal, ViewController } from 'ionic-angular';
import { AmcMongoStagesReq } from '../../../../../dataModels/amc-mongo-stages.model';


@IonicPage()
@Component({
  selector: 'page-topup-payment-method',
  templateUrl: 'topup-payment-method.html',
})
export class TopupPaymentMethodPage {

  headerTitle: string = 'Verify Transaction';
  topUpReq: TopUpReq;
  amcMongoReq = new AmcMongoStagesReq();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController
  ) {
    this.topUpReq = this.navParams.get('topUpReq');
    this.amcMongoReq = this.navParams.get('amcMongoReq');
    console.log('TopupPaymentMethodPage topUpReq ->', this.topUpReq);
  }

  proceedPayment(paymentMethod: string) {
    console.log('proceedPayment ->', paymentMethod);

    this.topUpReq.paymentMethodSelected = paymentMethod;
    console.log('topUpReq ->', this.topUpReq);

    let options = {
      showBackdrop: true,
      enableBackdropDismiss: true,
    };
    let paynowModal: Modal = this.modalCtrl.create(VerifyTransactionTopupPage, { 'topUpReq': this.topUpReq, 'amcMongoReq': this.amcMongoReq, 'nav': this.navParams.get('nav') }, options);
    paynowModal.present();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad TopupPaymentMethodPage');
  }

}
