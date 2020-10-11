import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Modal, ModalController } from 'ionic-angular';
import { InitialWithdrawTncPage } from '../initial-withdraw-tnc/initial-withdraw-tnc';
import { ProcessPartialWithdrawalReq } from '../../../../../../dataModels/process-partial-withdraw.model';
import { AmcMongoStagesReq, TermAndCondition } from '../../../../../../dataModels/amc-mongo-stages.model';
import { OtpScreenData, OtpPage } from '../../../../../auth-pages/otp/otp';
import { AlertService } from '../../../../../../providers/plugin-services/alert.service';
import { LogonService } from '../../../../../../providers/services/auth/logon.service';
import { AmcMongoStagesService } from '../../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';
import { ProcessPartialWithdrawalService } from '../../../../../../providers/services/main-module-services/partial-withdraw-module-services/process-partial-withdrawal.service';
import { HtmlContentService } from '../../../../../../providers/services/common-pages/html-content.service';
import { GetTransactionNumberService } from '../../../../../../providers/services/main-module-services/buy-product-module-services/get-transaction-number.service';
import { CustomFirebaseAnalyticsProvider } from '../../../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageName, LocalStorageKey, Lob, ClientDetailsStorageKey } from '../../../../../../common/enums/enums';
import { GetTransactionNumberReq } from '../../../../../../dataModels/get-transaction-number.model';
import { HtmlContentReq, HtmlContentResp } from '../../../../../../dataModels/html-content.model';
import { SignupReq } from '../../../../../../dataModels/signup.model';
import { CategoryMatrixReq } from '../../../../../../dataModels/category-matrix.model';
import { CreateSrPdfReq } from '../../../../../../dataModels/create-sr-pdf.model';
import { GetPdfFileAsBase64Req } from '../../../../../../dataModels/get-pdf-file-as-base64.model';
import { RaiseServiceRequestReq } from '../../../../../../dataModels/raise-service-request.model';
import { Utils } from '../../../../../../common/utils/utils';
import { FinalDocProcessReq } from '../../../../../../dataModels/final-doc-process.model';
import { Environment } from '../../../../../../common/constants/constants';
import { ApplyInitialwithdrawPage } from '../apply-initial-withdraw/apply-initial-withdraw';
import { ClientDetailsReq, ClientDetailsResp } from '../../../../../../dataModels/client-details.model';
import { ClientDetailsService } from '../../../../../../providers/services/main-module-services/product-services/client-details.service';


@IonicPage()
@Component({
  selector: 'page-initial-withdraw-verify',
  templateUrl: 'initial-withdraw-verify.html',
})
export class InitialWithdrawVerifyPage {

  headerTitle: string = 'Withdrawal Request';
  partialHistoryIcon: string = 'assets/imgs/Inbox.png';
  processPartialWithdrawalReq = new ProcessPartialWithdrawalReq();
  pensionMongoReq: AmcMongoStagesReq = new AmcMongoStagesReq();
  otpData: OtpScreenData = new OtpScreenData();
  tnc = new TermAndCondition();
  contactId: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertService: AlertService,
    public logonService: LogonService,
    public pensionMongoStagingService: AmcMongoStagesService,
    public processPartialWithdrawalService: ProcessPartialWithdrawalService,
    public htmlContentService: HtmlContentService,
    public modalCtrl: ModalController,
    public getTransactionNumberService: GetTransactionNumberService,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider,
    public clientDetailsService: ClientDetailsService
  ) {
    this.processPartialWithdrawalReq = this.navParams.get('processPartialWithdrawalReq');
    this.pensionMongoReq = this.navParams.get('pensionMongoReq');
    console.log("processPartialWithdrawalReq==>", this.processPartialWithdrawalReq);

    this.setupPage();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PartialWithdrawVerifyPage');
    this.tnc.checked = false;
    this.openTnC();

    this.getTransactionNumber().then((tranNum: string) => {
      this.processPartialWithdrawalReq.transactionNumber = tranNum;
    });

    this.getClientDetails();

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('InitialWithdrawVerify');
  }

  setupPage() {
    this.otpData.navigateFromPage = PageName.PensionWithdrawVerifyPage;
    this.otpData.title = 'Withdrawal Request';
    this.otpData.subTitle = this.otpData.subTitle = 'Product : ' + this.processPartialWithdrawalReq.policyName + ' - ' + this.processPartialWithdrawalReq.policyNo;
    this.otpData.stepCount = "4";
    this.otpData.stepUrl = "assets/imgs/Group%2019338.png";
  }

  getTransactionNumber() {
    return new Promise((resolve, reject) => {
      let req = new GetTransactionNumberReq();
      req.transactionType = "pensionWithdrawal";
      req.policyNumber = this.processPartialWithdrawalReq.policyNo;

      this.getTransactionNumberService.getTransactionNumber(req, (resp) => {
        resolve(resp.transactionNumber);
      })
    });
  }

  openTnC() {
    let htmlReq = new HtmlContentReq();
    htmlReq.contentType = 'pension withdrawal';

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
    let tncModal: Modal = this.modalCtrl.create(InitialWithdrawTncPage, { 'tnc': this.tnc.termAndCondition, 'nav': this.navCtrl }, options);
    tncModal.present();
  }

  proceedClicked() {
    if (!this.tnc.checked) return;

    let catMatReq = this.createCategoryMatrixReq();
    let pdfReq = this.createPdfReq();
    let base64Req = this.createPdfFileAsBase64Req();
    let serviceReq = this.createServiceReq();
    let docReq = this.finalDocProcessReq();

    if (Environment.dev || Environment.qa || Environment.uat || Environment.uatHttps) {
    }

    this.updateMongoStages();
    this.processPartialWithdrawalReq.tnc = this.tnc;

    let signupReq = new SignupReq();
    signupReq.idOptionKey = 'nationalId';
    signupReq.idValue = localStorage.getItem(LocalStorageKey.NationalID);

    this.navCtrl.push(OtpPage, {
      'signupData': signupReq,
      'processPartialWithdrawalReq': this.processPartialWithdrawalReq,
      'otpData': this.otpData,
      'pensionMongoReq': this.pensionMongoReq,
      'categoryMatrixReq': catMatReq,
      'createSrPdfReq': pdfReq,
      'getPdfFileAsBase64Req': base64Req,
      'raiseServiceReq': serviceReq,
      'finalDocProcessReq': docReq
    });
  }

  createCategoryMatrixReq() {
    let catMatReq = new CategoryMatrixReq();
    catMatReq.lob = "Retail Pension";
    catMatReq.action = "Withdrawal";

    return catMatReq;
  }

  createPdfReq() {
    let pdfReq = new CreateSrPdfReq();
    // pdfReq.category = "";
    pdfReq.clientDetailsJson = this.updateClientDetailJson();
    pdfReq.jsonArray = this.updateJsonArray();
    pdfReq.folderName = "Customer Portal";
    pdfReq.idType = localStorage.getItem(LocalStorageKey.NationalIDType);
    pdfReq.idValue = localStorage.getItem(LocalStorageKey.NationalID);
    pdfReq.lob = Lob.PENSION;
    pdfReq.personType = "";
    pdfReq.policyNo = this.processPartialWithdrawalReq.policyNo;
    pdfReq.product = this.processPartialWithdrawalReq.policyName;
    pdfReq.transactionNumber = this.processPartialWithdrawalReq.transactionNumber;
    pdfReq.transactionType = "pensionWithdrawal";
    pdfReq.type = "pension-withdrawal-pdf";
    pdfReq.userid = "";

    return pdfReq;
  }

  updateJsonArray() {
    let jsonArray = [];
    let obj = {};

    if (this.processPartialWithdrawalReq.paymentMode == "D") {
      obj['paymentMode'] = "BANK";
      obj['branchName'] = this.processPartialWithdrawalReq.bankBranch;
      obj['bankAccountNo'] = this.processPartialWithdrawalReq.bankAccNo;
      obj['bankName'] = this.processPartialWithdrawalReq.bankName;
      obj['accountHolderName'] = this.processPartialWithdrawalReq.accountName;
    }
    else {
      obj['paymentMode'] = "MPESA";
      obj['mpesaNumber'] = this.processPartialWithdrawalReq.mobile;
    }

    obj['otpMobileNo'] = "";
    obj['otp'] = "";
    obj['accountNumber'] = this.processPartialWithdrawalReq.policyNo;
    obj['maximumAmount'] = this.processPartialWithdrawalReq.netValue;
    obj['maximumAmount'] = this.processPartialWithdrawalReq.netValue;
    obj['withDrawalAmount'] = this.processPartialWithdrawalReq.withdrawalAmount;

    jsonArray.push(obj);

    return jsonArray;
  }

  updateClientDetailJson() {
    let obj = {};
    obj['passportNumber'] = localStorage.getItem(ClientDetailsStorageKey.PassportNumber) || "";
    obj['personStatus'] = localStorage.getItem(ClientDetailsStorageKey.PersonStatus) || "";
    obj['gender'] = localStorage.getItem(ClientDetailsStorageKey.Gender) || "";
    obj['contactId'] = localStorage.getItem(ClientDetailsStorageKey.contactId) || "";
    obj['pinNumber'] = localStorage.getItem(ClientDetailsStorageKey.PinNumber) || "";
    obj['dateOfBirth'] = localStorage.getItem(ClientDetailsStorageKey.DateOfBirth) || "";
    obj['firstName'] = localStorage.getItem(ClientDetailsStorageKey.FirstName) || "";
    obj['nationality'] = localStorage.getItem(ClientDetailsStorageKey.Nationality) || "";
    obj['surname'] = localStorage.getItem(ClientDetailsStorageKey.LastName) || "";
    obj['nationalIdNumber'] = localStorage.getItem(LocalStorageKey.NationalID) || "";
    obj['middleName'] = localStorage.getItem(ClientDetailsStorageKey.LastName) || "";
    obj['salutation'] = localStorage.getItem(ClientDetailsStorageKey.Salutation) || "";
    obj['contacts'] = [{ mobileNumber: localStorage.getItem(ClientDetailsStorageKey.PhoneNumber) || "", email: localStorage.getItem(ClientDetailsStorageKey.Email) || "" }];
    return obj
  }

  createPdfFileAsBase64Req() {
    let base64Req = new GetPdfFileAsBase64Req();
    base64Req.transactionNumber = this.processPartialWithdrawalReq.transactionNumber;

    return base64Req;
  }

  createServiceReq() {
    let srReq = new RaiseServiceRequestReq();
    srReq.autoIncID = 'C' + Utils.autoIncID();
    srReq.commMethod = 'Customer';
    srReq.userDetails.idValue = localStorage.getItem(LocalStorageKey.NationalID);
    srReq.userDetails.idType = localStorage.getItem(LocalStorageKey.NationalIDType);
    srReq.policyNo="";
    srReq.contactId = this.contactId;
    srReq.attachment = [];
    srReq.message = this.setSummary();

    return srReq;
  }

  setSummary() {
    let message = "NATIONAL ID=" + localStorage.getItem(LocalStorageKey.NationalID) +
      ",Policy Number=" + this.processPartialWithdrawalReq.policyNo +
      ",First Name=" + localStorage.getItem(ClientDetailsStorageKey.FirstName) +
      ",Middle Name=" + localStorage.getItem(ClientDetailsStorageKey.MiddleName) +
      ",Last Name=" + localStorage.getItem(ClientDetailsStorageKey.LastName) +
      ",Maximum Amount=" + this.processPartialWithdrawalReq.netValue +
      ",Withdraw Amount=" + this.processPartialWithdrawalReq.withdrawalAmount;

    return message;
  }

  finalDocProcessReq() {
    let docReq = new FinalDocProcessReq();

    docReq.emailAddress = localStorage.getItem(ClientDetailsStorageKey.Email);
    docReq.customerName = localStorage.getItem(ClientDetailsStorageKey.FirstName)+' '+localStorage.getItem(ClientDetailsStorageKey.MiddleName)+' '+localStorage.getItem(ClientDetailsStorageKey.LastName);
    docReq.policyNo = this.processPartialWithdrawalReq.policyNo;
    docReq.transactionType = "pensionWithdrawal";
    docReq.accountNumber = this.processPartialWithdrawalReq.policyNo;
    docReq.transactionNumber = this.processPartialWithdrawalReq.transactionNumber;

    return docReq;
  }

  goToWithdrawHistory() {
    // this.navCtrl.push(PartialWithdrawHistoryPage);
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
      // this.navCtrl.popTo(this.navCtrl.first());
      localStorage.setItem(LocalStorageKey.Delete, 'true');
      this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - 3));
    },
      error => {
      });
  }

  getClientDetails() {
    let reqData = new ClientDetailsReq();
    reqData.nationalIdNumber = localStorage.getItem(LocalStorageKey.NationalID);
    reqData.lobSrc = ''; // dynamic from category basis

    this.clientDetailsService.getClientDetails(reqData, (resp: ClientDetailsResp) => {
      this.contactId = resp.contactId;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getClientDetails();
          }
        })
      });
  }

  updateMongoStages() {
    this.pensionMongoReq.cp_pension_partial['termAndCondition'] = this.tnc;
    this.pensionMongoReq.cp_pension_partial['transactionNumber'] = this.processPartialWithdrawalReq.transactionNumber;

    this.pensionMongoStagingService.updateAmcMongoStage(this.pensionMongoReq, (resp) => {

    });
  }

}
