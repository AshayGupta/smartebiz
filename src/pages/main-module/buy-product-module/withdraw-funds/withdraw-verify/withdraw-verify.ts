import { PostedAmounts } from './../../../../../dataModels/make-payment.model';
import { HtmlContentService } from './../../../../../providers/services/common-pages/html-content.service';
import { HtmlContentReq, HtmlContentResp } from './../../../../../dataModels/html-content.model';
import { WithdrawTncModalPage } from './../withdraw-tnc-modal/withdraw-tnc-modal';
import { Utils } from './../../../../../common/utils/utils';
import { GetPdfFileAsBase64Req } from './../../../../../dataModels/get-pdf-file-as-base64.model';
import { CreateSrPdfReq, ClientDetailsJson, JsonArray } from './../../../../../dataModels/create-sr-pdf.model';
import { CategoryMatrixReq } from './../../../../../dataModels/category-matrix.model';
import { TermAndCondition, AmcMongoStagesReq } from './../../../../../dataModels/amc-mongo-stages.model';
import { LogonService } from './../../../../../providers/services/auth/logon.service';
import { TransactionChargesReq, TransactionChargesResp } from './../../../../../dataModels/transaction-charges.model';
import { TransactionCharges } from './../../../../../providers/services/main-module-services/buy-product-module-services/get-transaction-charges.service';
import { SignupReq } from './../../../../../dataModels/signup.model';
import { PageName, LocalStorageKey } from './../../../../../common/enums/enums';
import { AlertService } from './../../../../../providers/plugin-services/alert.service';
import { OtpScreenData, OtpPage } from './../../../../auth-pages/otp/otp';
import { TopUpReq, TransactionCharge } from './../../../../../dataModels/top-up.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Modal } from 'ionic-angular';
import { CreateTransactionReq } from '../../../../../dataModels/create-transaction.model';
import { RaiseServiceRequestReq } from '../../../../../dataModels/raise-service-request.model';
import { FinalDocProcessReq } from '../../../../../dataModels/final-doc-process.model';
import { AmcMongoStagesService } from '../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';

/**
 * Generated class for the WithdrawVerifyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-withdraw-verify',
  templateUrl: 'withdraw-verify.html',
})
export class WithdrawVerifyPage {

  headerTitle: string = 'Verify Withdraw';
  withdrawReq: TopUpReq = new TopUpReq();
  tranChrge: TransactionCharge = new TransactionCharge();
  otpData: OtpScreenData = new OtpScreenData();
  tnc = new TermAndCondition();
  createTransactionReq: CreateTransactionReq;
  raiseServiceReq: RaiseServiceRequestReq;
  categoryMatrixReq: CategoryMatrixReq;
  createSrPdfReq: CreateSrPdfReq;
  getPdfFileAsBase64Req: GetPdfFileAsBase64Req;
  finalDocProcessReq: FinalDocProcessReq;
  amcMongoReq: AmcMongoStagesReq;

  // get bankPayoutTag() { return BankPayoutValue; }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertService: AlertService,
    public transactionChargesService: TransactionCharges,
    public logonService: LogonService,
    public alert: AlertService,
    public amcMongoStageService: AmcMongoStagesService,
    public htmlContentService: HtmlContentService,
    public modalCtrl: ModalController
  ) {
    this.withdrawReq = this.navParams.get('withdrawReq');
    this.amcMongoReq = this.navParams.get('amcMongoReq');
    this.setupPage();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WithdrawVerifyPage');
    this.openTnC();
    this.setTansactionReq();
    this.tnc.checked = false;
    this.createTransactionRequest();
    this.createSrPdfRequest();
    this.createGetBase64StringRequest();
    this.createCategoryMatrixRequest();
    this.raiseServiceRequest();
    this.createFinalDocProcessRequest();
  }
  setupPage() {
    this.otpData.navigateFromPage = PageName.WithdrawVerifyPage;
    this.otpData.title = 'Verify Withdraw'
    this.otpData.subTitle = 'Account Number : ' + this.withdrawReq.accountNumber;
    this.otpData.stepCount = "4";
    this.otpData.stepUrl = "assets/imgs/Group%2019338.png";
  }

  setTansactionReq() {
    let promises = [];
    let totalCharges = 0;
    this.withdrawReq.postedAmount.forEach((fund, i) => {
      let promise = this.getTransactionCharges(fund, i).then((charges: string) => {
        totalCharges += parseInt(charges);
      });
      promises.push(promise);
    });
    Promise.all(promises).then(() => {
      this.withdrawReq.totalCharges = totalCharges.toString();
      console.log("withdrawReq", this.withdrawReq);
    });

  }

  getTransactionCharges(fund: PostedAmounts, index) {
    return new Promise((resolve, reject) => {
      let reqData = new TransactionChargesReq();
      reqData.lobSrc = this.withdrawReq.lobSrc;
      reqData.amount = fund.amount;
      reqData.transactionType = "withdrawal";
      reqData.clientCode = this.withdrawReq.postedAmount[0].clientCode;
      reqData.payoutMethodName = this.withdrawReq.paymentMode;
      reqData.fundCode = fund.fundCode;

      this.transactionChargesService.getTransactionCharges(reqData, (resp: TransactionChargesResp) => {
        this.withdrawReq.postedAmount[index].deduction = new TransactionChargesResp();
        this.withdrawReq.postedAmount[index].deduction = resp;
        this.tranChrge.withdrawalCharge = resp.doubleWithdrawalCharge;
        this.tranChrge.fundTransfer = resp.fundTransfer;
        this.tranChrge.totalCharges = (parseInt(this.tranChrge.withdrawalCharge) + parseInt(this.tranChrge.fundTransfer)).toString();
        this.withdrawReq.postedAmount[index].totalDeduction = this.tranChrge.totalCharges;
        resolve(this.tranChrge.totalCharges);

        // this.withdrawReq.transactionCharges = this.tranChrge;
      }, (error: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getTransactionCharges(fund, index);
          }
        })
      });
    });
  }

  proceedClicked() {
    if (!this.tnc.checked) return;
    let signupReq = new SignupReq();
    signupReq.idOptionKey = 'nationalId';
    signupReq.idValue = localStorage.getItem(LocalStorageKey.NationalID);

    this.withdrawReq.tnc = this.tnc;
    this.setMongoStage();
    console.log('withdrawReq', this.withdrawReq);
    this.navCtrl.push(OtpPage,
      {
        'signupData': signupReq,
        'withdrawReq': this.withdrawReq,
        'otpData': this.otpData,
        'categoryMatrixReq': this.categoryMatrixReq,
        'createTransactionReq': this.createTransactionReq,
        'createSrPdfReq': this.createSrPdfReq,
        'getPdfFileAsBase64Req': this.getPdfFileAsBase64Req,
        'finalDocProcessReq': this.finalDocProcessReq,
        'raiseServiceReq': this.raiseServiceReq,
        'amcMongoReq': this.amcMongoReq
      });
  }

  openTnC() {
    let htmlReq = new HtmlContentReq();
    htmlReq.contentType = 'amc withdrawal';

    this.htmlContentService.getHtmlFromServer(htmlReq, (resp: HtmlContentResp) => {
      this.tnc.termAndCondition = resp.content;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.openTnC();
          }
        })
      });
  }

  openTncModal() {
    if (this.tnc.termAndCondition == undefined) {
      this.tnc.termAndCondition = "terms and conditions not found."
    }
    let options = {
      showBackdrop: true,
      enableBackdropDismiss: true,
    };
    let tncModal: Modal = this.modalCtrl.create(WithdrawTncModalPage, { 'tnc': this.tnc.termAndCondition, 'nav': this.navCtrl }, options);
    tncModal.present();
  }

  setMongoStage() {
    this.amcMongoReq.cp_amc_withdrawal.termAndCondition = new TermAndCondition();
    this.amcMongoReq.cp_amc_withdrawal.termAndCondition = this.withdrawReq.tnc;

    this.amcMongoStageService.updateAmcMongoStage(this.amcMongoReq, (resp: any) => {
    });
  }


  editClicked() {
    this.navCtrl.popTo(this.navCtrl.getByIndex(1));
  }

  deleteClicked() {
    let deleteMsg: string = "Do you really want to delete?";
    let titleMsg: string = "You are almost done!";
    let successBtn: string = "YES";
    let failureBtn: string = "NO";

    this.alertService.Alert.confirm(deleteMsg, titleMsg, failureBtn, successBtn).then(res => {
      this.navCtrl.popTo(this.navCtrl.first());
    },
      error => {

      });
  }

  tncCheckboxClicked(event) {
    console.log("tncCheckboxClicked -> ", event);
  }

  createTransactionRequest() {
    this.createTransactionReq = new CreateTransactionReq();
    let phone = Utils.removeNull(this.withdrawReq.PhoneNumber);
    this.createTransactionReq.msisdn = phone.replace("+", ""); //'254711535989'
    this.createTransactionReq.accountNumber = this.withdrawReq.accountNumber;
    this.createTransactionReq.channel = "Mobile-App";
    this.createTransactionReq.customerId = "";
    this.createTransactionReq.transactionType = "Withdrawal";
    this.createTransactionReq.firstName = this.withdrawReq.firstname;
    this.createTransactionReq.middleName = this.withdrawReq.middlename;
    this.createTransactionReq.lastName = this.withdrawReq.lastname;
    this.createTransactionReq.paybillNumber = "899885";
    this.createTransactionReq.lobSrc = this.withdrawReq.lobSrc;
    this.createTransactionReq.totalAmount = this.withdrawReq.amount;
    this.createTransactionReq.postedAmount = this.setPostedAmount();
  }

  setPostedAmount() {
    let code: string = "";
    if (this.withdrawReq.paymentMode == "BANK") {
      code = this.withdrawReq.bankNumber;
    } else {
      code = this.withdrawReq.mpesaBankNumber;
    }
    let postedAmounts: PostedAmounts[] = [];
    this.withdrawReq.postedAmount.forEach((data) => {
      let posted = new PostedAmounts();
      posted.accountNumber = data.accountNumber;
      posted.amount = data.amount;
      posted.clientCode = data.clientCode;
      posted.fundCode = data.fundCode;
      posted.fundName = data.fundName;
      posted.paymentBankCode = code;
      posted.paymentMode = this.withdrawReq.paymentMode;
      posted.transactionType = data.transactionType;
      postedAmounts.push(posted);
    });
    return postedAmounts;
  }

  createSrPdfRequest() {
    this.createSrPdfReq = new CreateSrPdfReq();
    this.createSrPdfReq.category = "";//this.categoryMatrix[0].category;
    this.createSrPdfReq.clientDetailsJson = this.setClientDetailsJson();
    this.createSrPdfReq.jsonArray = [];
    this.setJsonArray();
    this.createSrPdfReq.folderName = "Customer Portal";
    this.createSrPdfReq.idType = this.withdrawReq.userDetails.idType;
    this.createSrPdfReq.idValue = this.withdrawReq.userDetails.idValue;
    this.createSrPdfReq.lob = this.withdrawReq.lobSrc;
    this.createSrPdfReq.personType = "";
    this.createSrPdfReq.policyNo = this.withdrawReq.accountNumber;
    this.createSrPdfReq.product = this.withdrawReq.postedAmount[0].fundCode;
    this.createSrPdfReq.transactionNumber = this.withdrawReq.transactionNumber;
    this.createSrPdfReq.transactionType = "withdrawal";
    this.createSrPdfReq.type = "amc-withdraw-pdf";
    this.createSrPdfReq.userid = "";
  }

  setClientDetailsJson() {
    let json = new ClientDetailsJson();
    json.personStatus = this.withdrawReq.personStatus;
    json.occupation = this.withdrawReq.occupation;
    json.gender = this.withdrawReq.gender;
    json.pinNumber = this.withdrawReq.pinNumber;
    json.dateOfBirth = this.withdrawReq.dateOfBirth;
    json.taxStatus = "";
    json.firstName = this.withdrawReq.firstname
    json.middleName = this.withdrawReq.middlename
    json.surname = this.withdrawReq.lastname;
    json.nationality = this.withdrawReq.nationality;
    json.systemcode = "";
    json.nationalIdNumber = localStorage.getItem(LocalStorageKey.NationalID);
    json.salutation = this.withdrawReq.salutation;
    return json;
  }

  setJsonArray() {
    this.withdrawReq.postedAmount.forEach(data => {
      let json = new JsonArray();
      json.transactionType = data.transactionType;
      json.holdingAmount = data.currentHoldingValue;
      json.amount = data.amount;
      json.bankAccountNo = this.withdrawReq.bankAccNo;
      json.bankName = this.withdrawReq.bankName;
      json.branchName = this.withdrawReq.bankBranch;
      json.paymentMode = this.withdrawReq.paymentMode == "BANK" ? "BANK" : "MPESA";
      json.paymentBankCode = this.withdrawReq.bankNumber;
      json.accountNumber = data.accountNumber
      json.clientCode = data.clientCode;
      json.fundCode = data.fundCode;
      json.fundName = data.fundName;
      json.accountHolderName = this.withdrawReq.accountName;
      this.createSrPdfReq.jsonArray.push(json);
    })
  }

  createGetBase64StringRequest() {
    this.getPdfFileAsBase64Req = new GetPdfFileAsBase64Req();
    this.getPdfFileAsBase64Req.transactionNumber = this.withdrawReq.transactionNumber;
  }
  
  raiseServiceRequest() {
    this.raiseServiceReq = new RaiseServiceRequestReq();
    this.raiseServiceReq.autoIncID = 'C' + Utils.autoIncID();
    this.raiseServiceReq.commMethod = 'Customer';
    this.raiseServiceReq.userDetails.idValue = localStorage.getItem(LocalStorageKey.NationalID);
    this.raiseServiceReq.userDetails.idType = localStorage.getItem(LocalStorageKey.NationalIDType);
    this.raiseServiceReq.policyNo = this.withdrawReq.accountNumber;
    this.setSummary();
    // this.raiseServiceReq.category = this.categoryMatrix[0].category;
    // this.raiseServiceReq.subCategory = this.categoryMatrix[0].subCategory;//'Instruction';
    this.raiseServiceReq.fileAttachment = [];
    this.raiseServiceReq.commMethod = "";
    // this.raiseServiceReq.message = "You have Withdrawal KES "+this.withdrawReq.amount+" amount from you account";
  }
  setSummary() {
    let message: string;
    let payoutMethod: string = this.withdrawReq.paymentMode == "BANK" ? "BANK" : "MPESA";
    message = "NATIONAL ID=" + localStorage.getItem(LocalStorageKey.NationalID) + ",Policy Number=" + this.withdrawReq.accountNumber;
    if (this.withdrawReq.paymentMode == "D") {
      message += ",Payout Method=" + payoutMethod + ",Bank Name=" + this.withdrawReq.bankName + ",Branch Name=" + this.withdrawReq.bankBranch + ",Bank Account Number=" + this.withdrawReq.bankAccNo + ",Account Holder=" + this.withdrawReq.accountName;
    } else {
      message += ",Payout Method=" + payoutMethod + ",Mobile Number=" + this.withdrawReq.PhoneNumber;
    }
    this.withdrawReq.postedAmount.forEach(data => {
      message += "," + data.fundName + "=" + data.amount + ",LOB=Asset Management";
    });
    this.raiseServiceReq.message = message;
    console.log(message);
  }
  createFinalDocProcessRequest() {
    this.finalDocProcessReq = new FinalDocProcessReq();
    this.finalDocProcessReq.emailAddress = this.withdrawReq.email;
    this.finalDocProcessReq.customerName = this.withdrawReq.firstname;
    this.finalDocProcessReq.policyNo = this.withdrawReq.accountNumber;
    // this.finalDocProcessReq.srNumber=this.srNumber;
    this.finalDocProcessReq.transactionType = "amcWithdrawal";
    this.finalDocProcessReq.accountNumber = this.withdrawReq.accountNumber;
    this.finalDocProcessReq.totalAmount = this.withdrawReq.amount;
    this.finalDocProcessReq.transactionNumber = this.withdrawReq.transactionNumber;
  }
  createCategoryMatrixRequest() {
    this.categoryMatrixReq = new CategoryMatrixReq();
    this.categoryMatrixReq.lob = "UTF/WMF/DISCRET"
    this.categoryMatrixReq.action = "Redemption";
  }

}
