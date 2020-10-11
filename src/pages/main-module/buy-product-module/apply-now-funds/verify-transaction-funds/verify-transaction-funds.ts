import { LocalStorageKey, MongoAMCStaging } from './../../../../../common/enums/enums';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { VerifyPaymentModalInterface } from '../../../../common-pages/payment/verify-payment-modal/verify-payment-modal';
import { BuyProductReq, Investment } from '../../../../../dataModels/buy-product-model';
import { PayNowFinalPaymentPage } from '../../../pay-now-module/pay-now-final-payment/pay-now-final-payment';
import { MakePaymentReq, PostedAmounts } from '../../../../../dataModels/make-payment.model';
import { CreateAccountService } from '../../../../../providers/services/main-module-services/pay-now-module-services/create-account.service';
import { CreateAccountResp, CreateAccountReq } from '../../../../../dataModels/create-account.model';
import { AlertService } from '../../../../../providers/plugin-services/alert.service';
import { FundsList } from '../../../../../dataModels/product-action-items.model';
import { AmcMongoStagesReq, Stages, Payment } from '../../../../../dataModels/amc-mongo-stages.model';
import { AmcMongoStagesService } from '../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';
import { Utils } from '../../../../../common/utils/utils';

@IonicPage()
@Component({
  selector: 'page-verify-transaction-funds',
  templateUrl: 'verify-transaction-funds.html',
})
export class VerifyTransactionFundsPage {

  headerTitle: string = 'Verify Transaction';
  buyProductReq: BuyProductReq;
  verifyTransaction: VerifyPaymentModalInterface;
  paymentMethodSelected: string;
  onboardingMongoReq = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    private createAccountService: CreateAccountService,
    public alert: AlertService,
    private amcMongoStagesService: AmcMongoStagesService
  ) {
    this.buyProductReq = this.navParams.get('buyProductReq');
    this.onboardingMongoReq = this.navParams.get('amcMongoReq');
    console.log('VerifyTransactionFundsPage buyProductReq ->', this.buyProductReq);

    if (this.buyProductReq.paymentMethodSelected == 'mpesa') {
      this.paymentMethodSelected = "M-PESA";
    }
    this.verifyTransaction = {
      title: "Verify Transaction",
      message: "Continue to Pay via " + this.paymentMethodSelected + " ?",
      amount: this.buyProductReq.investment.totalAmount,
      payVia: this.paymentMethodSelected,
      currency: "KES ",
      buttonText: "PAY VIA " + this.paymentMethodSelected
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerifyTransactionFundsPage');
  }

  clickOnPay() {
    this.createAccount().then((res: CreateAccountResp) => {
      let options = {
        showBackdrop: true,
        enableBackdropDismiss: true,
      };

      let paymentReq = new MakePaymentReq();
      paymentReq.firstName = this.buyProductReq.personalDetail.firstName;
      paymentReq.middleName = this.buyProductReq.personalDetail.middleName;
      paymentReq.lastName = this.buyProductReq.personalDetail.lastName;
      paymentReq.accountNumber = res.accountCode;
      paymentReq.amount = this.buyProductReq.investment.totalAmount;
      paymentReq.totalAmount = this.buyProductReq.investment.totalAmount;
      let phone: string = Utils.removeNull(this.buyProductReq.personalDetail.mobile);
      phone = phone.replace("+", "").replace(/^0+/, '254'); //'254711535989'
      paymentReq.phoneNumber=phone;
      paymentReq.msisdn = phone;
      paymentReq.policyNo="";

      paymentReq.paybillNumber = "899885";
      paymentReq.lobSrc = this.buyProductReq.lobSrc;
      paymentReq.productName = this.buyProductReq.investment.selectedFund.productName;
      paymentReq.userDetails = this.buyProductReq.userDetails;
      paymentReq.transactionNumber = this.buyProductReq.bankDetail.transactionNumber;
      paymentReq.email = this.buyProductReq.personalDetail.email;
      paymentReq.action = "Create";
      paymentReq.channel = "Mobile-App";
      paymentReq.customerId = res.accountID;
      paymentReq.transactionType = "amcOnboarding";
      paymentReq.postedAmount = this.setPostedAmtData(paymentReq, this.buyProductReq.investment);
      paymentReq.Summary=this.setSummary(paymentReq);
      paymentReq.docType="BankProof";

      this.setStagesInMongo(MongoAMCStaging.Done);

      localStorage.setItem(LocalStorageKey.PageFlow, "AmcOnboarding");

      let paynowModal = this.modalCtrl.create(PayNowFinalPaymentPage, { 'paymentReq': paymentReq, 'paymentOption': this.verifyTransaction.payVia, 'nav': this.navParams.get('nav'), 'amcMongoReq': this.onboardingMongoReq }, options);
      paynowModal.present();
    });
  }

  setPostedAmtData(paymentReq: MakePaymentReq, investment: Investment) {
    let postedAmtArray: PostedAmounts[] = [];

    let obj = new PostedAmounts();
    obj.accountNumber = paymentReq.accountNumber;
    obj.paymentMode = this.buyProductReq.paymentMethodSelected.toUpperCase();
    obj.amount = investment.selectedFund.investedAmount;
    obj.clientCode = "";
    obj.fundCode = investment.selectedFund.productCode;
    obj.fundName = investment.selectedFund.productName;
    obj.paymentBankCode = "";
    obj.transactionType = "Lump-sum";
    postedAmtArray.push(obj);

    investment.moreFunds.filter(item => {
      let obj = new PostedAmounts();
      obj.accountNumber = paymentReq.accountNumber;
      obj.paymentMode = this.buyProductReq.paymentMethodSelected.toUpperCase();
      obj.amount = item.investedAmount;
      obj.clientCode = "";
      obj.fundCode = item.productCode;
      obj.fundName = item.productName;
      obj.paymentBankCode = "";
      obj.transactionType = "Lump-sum";
      postedAmtArray.push(obj);
    })

    return postedAmtArray;
  }

  createAccount() {
    return new Promise((resolve, reject) => {
      let req = new CreateAccountReq();
      var bankDetailClone = Object.assign({}, this.buyProductReq.bankDetail);
      delete bankDetailClone.transactionNumber;
      delete bankDetailClone.documents;

      req.bankDetails.push(bankDetailClone);
      req.lobSrc = this.buyProductReq.lobSrc;
      req.nationalId = this.buyProductReq.userDetails.idValue;
      req.pinNumber = this.buyProductReq.personalDetail.kraPin;
      req.firstname = this.buyProductReq.personalDetail.firstName;
      req.middlename = this.buyProductReq.personalDetail.middleName;
      req.lastname = this.buyProductReq.personalDetail.lastName;
      // req.dateCreated = new Date().toUTCString();
      req.iprsVerified = this.buyProductReq.personalDetail.iprsVerified;
      req.active = "1";
      req.address = this.buyProductReq.personalDetail.physicalAddress;

      let phone: string = Utils.removeNull(this.buyProductReq.personalDetail.mobile);
      phone = phone.replace("+", "").replace(/^0+/, '254'); //'254711535989'
      req.msisdn = phone;

      req.terms = String(this.buyProductReq.tnc);
      // req.dateOfBirth = this.buyProductReq.personalDetail.dob;
      // req.billReferenceNumber
      // req.source
      req.email = this.buyProductReq.personalDetail.email;
      req.source="Mobile-App";
      // req.clientIdentifierType
       req.generateAccountCode="Y";

      this.createAccountService.createAccount(req, (resp: CreateAccountResp) => {
        resolve(resp);
      })
    });
  }

  setStagesInMongo(status: string) {
    this.onboardingMongoReq["stages"].filter(item => {
      if (item.name == "payment") {
        item.status = status;
      }
    });
    
    let payment = new Payment();
    payment.amount = this.buyProductReq.investment.totalAmount;
    payment.date = new Date().toUTCString();
    payment.paymentMethod = this.buyProductReq.paymentMethodSelected;

    this.onboardingMongoReq["payment"] = [];
    this.onboardingMongoReq["payment"].push(payment);

    this.amcMongoStagesService.updateAmcMongoStage(this.onboardingMongoReq, (resp) => {
    })
  }

  setSummary(paymentReq:MakePaymentReq) {
    let message: string = "";
    message += "Account Number:" + paymentReq.accountNumber;
    paymentReq.postedAmount.forEach(data => {
      message += " fundCode:-" + data.fundCode + " Fund Name:" + data.fundName + " amount:" + data.amount;
    })
    return message;
  }

}
