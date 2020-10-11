import { AmcMongoStagesService } from './../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';
import { Stages, Payment } from './../../../../../dataModels/amc-mongo-stages.model';
import { Utils } from './../../../../../common/utils/utils';
import { LocalStorageKey, MongoAMCStaging } from './../../../../../common/enums/enums';
import { PayNowFinalPaymentPage } from './../../../pay-now-module/pay-now-final-payment/pay-now-final-payment';
import { TopUpReq } from './../../../../../dataModels/top-up.model';
import { AlertService } from './../../../../../providers/plugin-services/alert.service';
import { MakePaymentReq } from './../../../../../dataModels/make-payment.model';
import { VerifyPaymentModalInterface } from './../../../../common-pages/payment/verify-payment-modal/verify-payment-modal';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { AmcMongoStagesReq } from '../../../../../dataModels/amc-mongo-stages.model';


@IonicPage()
@Component({
  selector: 'page-verify-transaction-topup',
  templateUrl: 'verify-transaction-topup.html',
})
export class VerifyTransactionTopupPage {

  headerTitle: string = 'Verify Transaction';
  topUpReq: TopUpReq;
  verifyTransaction: VerifyPaymentModalInterface;
  paymentMethodSelected: string;
  amcMongoReq: AmcMongoStagesReq;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public alert: AlertService,
    public amcMongoStagesService: AmcMongoStagesService
  ) {
    this.topUpReq = this.navParams.get('topUpReq');
    this.amcMongoReq = this.navParams.get('amcMongoReq');
    console.log('VerifyTransactionTopUpPage topUpReq ->', this.topUpReq);


    if (this.topUpReq.paymentMethodSelected == 'mpesa') {
      this.paymentMethodSelected = "M-PESA";
    }
    this.verifyTransaction = {
      title: "Verify Transaction",
      message: "Continue to Pay via " + this.paymentMethodSelected + " ?",
      amount: this.topUpReq.amount,
      payVia: this.paymentMethodSelected,
      currency: "KES ",
      buttonText: "PAY VIA " + this.paymentMethodSelected
    }
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad VerifyTransactionTopupPage');
  }

  clickOnPay() {
    let options = {
      showBackdrop: true,
      enableBackdropDismiss: true,
    };

    let paymentReq = new MakePaymentReq();
    paymentReq.firstName = this.topUpReq.firstname;
    paymentReq.middleName = this.topUpReq.middlename;
    paymentReq.lastName = this.topUpReq.lastname;
    paymentReq.accountNumber = this.topUpReq.accountNumber;
    paymentReq.totalAmount = this.topUpReq.amount;
    paymentReq.amount = this.topUpReq.amount;
    let phone = Utils.removeNull(this.topUpReq.PhoneNumber);
    phone = phone.replace("+", "").replace(/^0+/, '254'); //'254711535989'
    paymentReq.phoneNumber = phone;
    paymentReq.msisdn = phone;
    paymentReq.policyNo=this.topUpReq.accountNumber;

    paymentReq.paybillNumber = "899885";//"827142";
    paymentReq.lobSrc = this.topUpReq.lobSrc;
    paymentReq.productName = "";
    this.topUpReq.postedAmount.filter(item => {
      item.paymentMode = this.topUpReq.paymentMethodSelected.toUpperCase();
    });
    paymentReq.postedAmount = this.topUpReq.postedAmount;
    paymentReq.userDetails = this.topUpReq.userDetails;
    paymentReq.transactionNumber = this.topUpReq.transactionNumber;
    paymentReq.email = this.topUpReq.email;
    paymentReq.channel = "Mobile-App";
    paymentReq.transactionType = "amcTopup";
    paymentReq.Summary = this.setSummary();

    localStorage.setItem(LocalStorageKey.PageFlow, "AmcTopUp");

    this.setStagesInMongo();

    let paynowModal = this.modalCtrl.create(PayNowFinalPaymentPage, { 'paymentReq': paymentReq, 'amcMongoReq': this.amcMongoReq, 'paymentOption': this.verifyTransaction.payVia, 'nav': this.navParams.get('nav') }, options);
    paynowModal.present();
  }

  setStagesInMongo() {
    let payment = new Payment();
    payment.amount = this.topUpReq.amount;
    payment.date = new Date().toUTCString();
    payment.paymentMethod = this.topUpReq.paymentMethodSelected;

    this.amcMongoReq.amcTopUp["payment"] = [];
    this.amcMongoReq.amcTopUp["payment"].push(payment);

    this.amcMongoStagesService.updateAmcMongoStage(this.amcMongoReq.amcTopUp, (resp) => {
    });
  }

  setSummary() {
    let message: string = "";
    message += "Account Number:" + this.topUpReq.accountNumber;
    this.topUpReq.postedAmount.forEach(data => {
      message += " fundCode:-" + data.fundCode + " Fund Name:" + data.fundName + " amount:" + data.amount;
    })
    return message;
  }

}
