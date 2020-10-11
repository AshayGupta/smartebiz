import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Modal, ViewController } from 'ionic-angular';
import { BuyProductReq } from '../../../../../dataModels/buy-product-model';
import { VerifyTransactionFundsPage } from '../verify-transaction-funds/verify-transaction-funds';
import { AmcMongoStagesReq } from '../../../../../dataModels/amc-mongo-stages.model';
import { AmcMongoStagesService } from '../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';


@IonicPage()
@Component({
  selector: 'page-funds-payment-method',
  templateUrl: 'funds-payment-method.html',
})
export class FundsPaymentMethodPage {

  headerTitle: string = 'Verify Transaction';
  buyProductReq: BuyProductReq;
  onboardingMongoReq = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
  ) {
    this.buyProductReq = this.navParams.get('buyProductReq');
    this.onboardingMongoReq = this.navParams.get('amcMongoReq');
    console.log('VerifyTransactionFundsPage buyProductReq ->', this.buyProductReq);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FundsPaymentMethodPage');
  }

  proceedPayment(paymentMethod: string) {
    console.log('proceedPayment ->', paymentMethod);

    this.buyProductReq.paymentMethodSelected = paymentMethod;
    console.log('buyProductReq ->', this.buyProductReq);

    let options = {
      showBackdrop: true,
      enableBackdropDismiss: true,
    };
    let paynowModal: Modal = this.modalCtrl.create(VerifyTransactionFundsPage, { 
      'buyProductReq': this.buyProductReq, 'nav': this.navParams.get('nav'), 'amcMongoReq': this.onboardingMongoReq }, options);
    paynowModal.present();
  }

}
