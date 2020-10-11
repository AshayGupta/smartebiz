import { PensionPaynowThankyouPage } from './../pension-paynow-thankyou/pension-paynow-thankyou';
import { AmcMongoStagesService } from './../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';
import { AmcMongoStagesReq, SrRequest } from './../../../../dataModels/amc-mongo-stages.model';
import { CreateSrPdfService } from './../../../../providers/services/main-module-services/buy-product-module-services/create-sr-pdf.service';
import { ThankYouTopupPage } from './../../buy-product-module/topup-funds/thank-you-topup/thank-you-topup';
import { OnboardingThankyouPage } from './../../buy-product-module/apply-now-funds/onboarding-thankyou/onboarding-thankyou';
import { AlertService } from './../../../../providers/plugin-services/alert.service';
import { RaiseRequestService } from './../../../../providers/services/main-module-services/service-request-services/raise-service-request.service';
import { MakePaymentResp } from './../../../../dataModels/make-payment.model';
import { MakePaymentService } from './../../../../providers/services/main-module-services/pay-now-module-services/make-payment.service';
import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { MakePaymentReq } from '../../../../dataModels/make-payment.model';
import { Utils } from '../../../../common/utils/utils';
import { LogonService } from '../../../../providers/services/auth/logon.service';
import { PayNowFinalSummaryPage } from '../pay-now-final-summary/pay-now-final-summary';
import { StatusCode, LocalStorageKey, MongoAMCStaging } from '../../../../common/enums/enums';
import { Subscription } from 'rxjs';
import { CustomFirebaseAnalyticsProvider } from '../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { CreateSrPdfReq, CreateSrPdfResp, ClientDetailsJson } from '../../../../dataModels/create-sr-pdf.model';
import { Environment } from '../../../../common/constants/constants';
import { PageTrack } from '../../../../common/decorators/page-track';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-pay-now-final-payment',
  templateUrl: 'pay-now-final-payment.html',
})
export class PayNowFinalPaymentPage implements OnDestroy {

  paymentReq: MakePaymentReq;
  paymentOption: any;
  resendOtpTxt: number = 0;
  otpResendTime: number = 120;  // 2 min counter
  makePaymentResp = new MakePaymentResp();
  showPopUp: boolean = true;
  subscription: Subscription;

  canceledMsg: string = 'Your Payment request has been cancelled by user please try again.';
  timeoutMsg: string = 'Your payment request has timed out. Please try again.';
  serverIssueMsg: string = 'Sorry, we are having some temporary server issues please try again.';
  invalidMPesaPinMsg: string = 'Invalid MPesa Pin. Please try again.';
  insufficientMsg: string = 'Your account balance is insufficient for this transaction.';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public makePaymentService: MakePaymentService,
    public logonService: LogonService,
    public raiseServiceReqService: RaiseRequestService,
    public createSrPdfService: CreateSrPdfService,
    public alertService: AlertService,
    public viewCtrl: ViewController,
    public amcMongoStageService: AmcMongoStagesService,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider
  ) {
    this.paymentReq = this.navParams.get('paymentReq');
    this.paymentOption = this.navParams.get('paymentOption');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ionViewDidLoad() {
    console.log('5', this.navCtrl);
    console.log('ionViewDidLoad PayNowFinalPaymentPage');

    if (
      localStorage.getItem(LocalStorageKey.PageFlow) == "AmcOnboarding" ||
      localStorage.getItem(LocalStorageKey.PageFlow) == "AmcTopUp" ||
      localStorage.getItem(LocalStorageKey.PageFlow) == "PensionPayNow"
    ) {
      this.createSrPdf().then(res => {
        this.startTimer(this.otpResendTime);
        this.makepayment();
      });
    }
    else {
      this.startTimer(this.otpResendTime);
      this.makepayment();
    }

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('PayNowFinalPaymentPage');
  }

  createSrPdf() {
    return new Promise((resolve, reject) => {
      let reqData = new CreateSrPdfReq();
      reqData.category = "";
      reqData.clientDetailsJson = new ClientDetailsJson();
      reqData.clientDetailsJson.amount = parseFloat(this.paymentReq.amount).toFixed(2);
      reqData.clientDetailsJson.customerName = this.paymentReq.firstName + ' ' + this.paymentReq.middleName + ' ' + this.paymentReq.lastName;

      let dateStr: string = new Date().toUTCString().substring(0, 10);
      let date = dateStr.split('-')[2] + "/" + dateStr.split('-')[1] + "/" + dateStr.split('-')[0];
      reqData.clientDetailsJson.date = date;

      reqData.clientDetailsJson.policyNumber = this.paymentReq.accountNumber;
      reqData.clientDetailsJson.transactionId = this.paymentReq.transactionNumber;
      reqData.folderName = "Customer Portal";
      reqData.idType = this.paymentReq.userDetails.idType;
      reqData.idValue = this.paymentReq.userDetails.idValue;

      let jsonArray = [];
      this.paymentReq.postedAmount.filter(item => {
        let obj = {
          amount: parseFloat(item.amount).toFixed(2),
          fundName: item.fundName,
          policyNumber: item.accountNumber
        }
        jsonArray.push(obj);
      });
      reqData.jsonArray = jsonArray;

      reqData.lob = this.paymentReq.lobSrc;
      reqData.personType = "";
      reqData.policyNo = this.paymentReq.accountNumber;
      reqData.product = this.paymentReq.postedAmount[0].fundCode;
      reqData.transactionNumber = this.paymentReq.transactionNumber;
      reqData.transactionType = "make-payment-pdf";
      reqData.userid = "";
      if (localStorage.getItem(LocalStorageKey.PageFlow) == "AmcOnboarding") {
        reqData.type = "onboarding-payment-pdf";
      }
      if (localStorage.getItem(LocalStorageKey.PageFlow) == "AmcTopUp") {
        reqData.type = "topup-payment-pdf";
      }
      if (localStorage.getItem(LocalStorageKey.PageFlow) == "PensionPayNow") {
        reqData.product = "Pension";
        reqData.transactionType = "pensionPayment";
        reqData.type = "make-payment-pdf";
      }

      this.createSrPdfService.createSrPdf(reqData, (resp: CreateSrPdfResp) => {
        resolve(resp);
      }, (error: boolean) => {
        this.logonService.getToken((istTokenValid: boolean) => {
          if (istTokenValid) {
            this.createSrPdf();
          }
        })
        resolve(error);
      });
    });
  }

  makepayment() {
    if (Environment.dev || Environment.qa || Environment.uat || Environment.uatHttps) {
      // this.paymentReq.phoneNumber = "254723079975"; // Maiywa
      // this.paymentReq.amount = "1";
      // this.paymentReq.totalAmount = "1"
      // this.paymentReq.email = "rajni.chauhan@infoaxon.com"
    }

    this.makePaymentService.makePayment(this.paymentReq, (resp: MakePaymentResp) => {
      this.makePaymentResp = resp;
      this.subscription.unsubscribe();

      if (resp.resultCode == '1032') {
        this.errorResponseMsg(this.canceledMsg);
      }
      else if (resp.resultCode == '1037') {
        this.errorResponseMsg(this.timeoutMsg);
      }
      else if (resp.resultCode == '-1') {
        this.errorResponseMsg(this.serverIssueMsg);
      }
      else if (resp.resultCode == '1') {
        this.errorResponseMsg(this.insufficientMsg);
      }
      else if (resp.resultCode == '2001') {
        this.errorResponseMsg(this.invalidMPesaPinMsg);
      }
      else if (resp.resultCode == '0') {
        let pushToPage;

        if (localStorage.getItem(LocalStorageKey.PageFlow) == "AmcOnboarding") {
          pushToPage = OnboardingThankyouPage;

          let mongoReq = this.navParams.get('amcMongoReq');
          mongoReq["stages"].filter(item => {
            if (item.name == "payment") {
              item.status = MongoAMCStaging.Done;
            }
          });

          let srReq = {
            srNumber: resp.srNumber,
            // srStatus: resp.
            srDateTime: new Date().toUTCString()
          }
          mongoReq["srRequest"] = srReq;

          this.setMongoStage(mongoReq);
        }
        else if (localStorage.getItem(LocalStorageKey.PageFlow) == "AmcTopUp") {
          pushToPage = ThankYouTopupPage;

          let mongoReq: AmcMongoStagesReq = this.navParams.get('amcMongoReq');
          mongoReq.amcTopUp["stages"].filter(item => {
            if (item.name == "paymentModeScreen") {
              item.status = MongoAMCStaging.Done;
            }
          });
          mongoReq.amcTopUp["payment"][0]["resultCode"] = resp.resultCode;
          mongoReq.amcTopUp["SR_Number"] = resp.srNumber;
          
          this.setMongoStage(mongoReq.amcTopUp);
        }
        else if (localStorage.getItem(LocalStorageKey.PageFlow) == "PensionPayNow") {
          pushToPage = PensionPaynowThankyouPage;

          let mongoReq: AmcMongoStagesReq = this.navParams.get('amcMongoReq');
          mongoReq.cp_pension_makecontribution["stages"].filter(item => {
            if (item.name == "SR-CREATED") {
              item.status = MongoAMCStaging.Done;
            }
          });

          let paymentStatus = {
            "dateTime": new Date().toUTCString(),
            "resultCode": resp.resultCode,
            "status": resp.resultDesc
          }
          mongoReq.cp_pension_makecontribution["paymentStatus"] = paymentStatus;
          mongoReq.cp_pension_makecontribution["srNumber"] = resp.srNumber;

          this.setMongoStage(mongoReq);
        }
        else {
          pushToPage = PayNowFinalSummaryPage;
        }

        this.navParams.get('nav').push(pushToPage, { 'paymentReq': this.paymentReq, 'paymentOption': this.paymentOption, 'paymentResp': this.makePaymentResp }).then(() => {
          this.navParams.get('nav').remove(1, this.navParams.get('nav').getActive().index - 1);
          this.navCtrl.remove(0, this.navCtrl.getActive().index).then(() => {
            this.navCtrl.pop()
          });
        });
      }
      else {
        this.errorResponseMsg(this.serverIssueMsg);
      }
    },
      err => {
        this.subscription.unsubscribe();
        if (err.status == StatusCode.Status403) {
          this.logonService.getToken((isTokenValid: boolean) => {
            if (isTokenValid) {
              this.makepayment();
            }
          })
        }
        else if (err.status == 0) {
          this.errorResponseMsg(this.serverIssueMsg);
        }
        else {
          this.errorResponseMsg(this.serverIssueMsg);
        }
      });

  }

  errorResponseMsg(message: any) {
    this.showPopUp = false;

    let errorMsg: string = message;
    let titleMsg: string = "Transaction Message!";
    let cancelTxt: string = "CANCEL";
    let successBtn: string = "RETRY";

    this.alertService.Alert.confirm(errorMsg, titleMsg, cancelTxt, successBtn).then(res => {
      this.startTimer(this.otpResendTime);
      this.makepayment();
      this.showPopUp = true;
    },
      error => {
        this.navCtrl.pop();
      });
  }


  startTimer(time: number) {
    this.subscription = Utils.startTimer(time).subscribe(data => {
      this.resendOtpTxt = data;
      if (data == 0) {
        this.navCtrl.pop();
      }
    });

  }

  cancelTransaction() {
  }

  setMongoStage(reqPacket: any) {
    this.amcMongoStageService.updateAmcMongoStage(reqPacket, (resp: any) => {

    })
  }



}
