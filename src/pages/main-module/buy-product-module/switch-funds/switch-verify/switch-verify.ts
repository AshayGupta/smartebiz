import { TransactionCharge } from './../../../../../dataModels/top-up.model';
import { TransactionChargesReq, TransactionChargesResp } from './../../../../../dataModels/transaction-charges.model';
import { TransactionCharges } from './../../../../../providers/services/main-module-services/buy-product-module-services/get-transaction-charges.service';
import { AmcMongoStagesService } from './../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';
import { Utils } from './../../../../../common/utils/utils';
import { SignupReq } from './../../../../../dataModels/signup.model';
import { FinalDocProcessReq } from './../../../../../dataModels/final-doc-process.model';
import { CategoryMatrixReq } from './../../../../../dataModels/category-matrix.model';
import { RaiseServiceRequestReq } from './../../../../../dataModels/raise-service-request.model';
import { CreateSwitchOrderReq, SwitchOrder } from './../../../../../dataModels/create-switch-order.model';
import { PageName, LocalStorageKey, MongoAMCStaging } from './../../../../../common/enums/enums';
import { OtpScreenData, OtpPage } from './../../../../auth-pages/otp/otp';
import { SwitchTncModalPage } from './../switch-tnc-modal/switch-tnc-modal';
import { TermAndCondition, AmcMongoStagesReq } from './../../../../../dataModels/amc-mongo-stages.model';
import { HtmlContentService } from './../../../../../providers/services/common-pages/html-content.service';
import { HtmlContentReq, HtmlContentResp } from './../../../../../dataModels/html-content.model';
import { LogonService } from './../../../../../providers/services/auth/logon.service';
import { Switch, TransferTo } from './../../../../../dataModels/switch.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Modal, ModalController } from 'ionic-angular';
import { AlertService } from '../../../../../providers/plugin-services/alert.service';


@IonicPage()
@Component({
  selector: 'page-switch-verify',
  templateUrl: 'switch-verify.html',
})
export class SwitchVerifyPage {

  headerTitle: string = 'Verify Switch';
  submitAttempt: boolean = false;
  switchReq: Switch = new Switch();
  otpData: OtpScreenData = new OtpScreenData();
  tnc = new TermAndCondition();
  amcMongoReq: AmcMongoStagesReq;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public logonService: LogonService,
    public htmlContentService: HtmlContentService,
    public modalCtrl: ModalController,
    public amcMongoStagingService: AmcMongoStagesService,
    public transactionChargesService: TransactionCharges,
    public alert: AlertService,
  ) {
    this.switchReq = this.navParams.get('switchReq');
    this.amcMongoReq = this.navParams.get('amcMongoReq');
    console.log('switchReq', this.switchReq);
    this.setupPage();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SwitchVerifyPage');
    this.openTnC();
    this.setTansactionReq();
    this.tnc.checked = false;
  }
  setupPage() {
    this.otpData.navigateFromPage = PageName.SwitchVerifyPage;
    this.otpData.title = 'Verify Switch'
    this.otpData.subTitle = 'Account Number : ' + this.switchReq.accountNumber;
    this.otpData.stepCount = "3";
    this.otpData.stepUrl = "assets/imgs/Group%2019341.png";
  }

  setTansactionReq() {
    let promises = [];
    let totalCharges = 0;
    this.switchReq.switchOrder.forEach((fund, i) => {
      fund.transferTo.forEach((data, j) => {
        let promise = this.getTransactionCharges(data, i).then((charge: TransactionCharge) => {
          totalCharges += parseFloat(charge.totalCharges);
          console.log(totalCharges)
        });
        promises.push(promise);
      });
    });

    Promise.all(promises).then(() => {
      this.switchReq.totalCharges = totalCharges.toFixed(2).toString();
      console.log("switchReq", this.switchReq);
    });
  }

  getTransactionCharges(fund: TransferTo, index) {

    return new Promise((resolve, reject) => {
      let reqData = new TransactionChargesReq();
      reqData.lobSrc = this.switchReq.lobSrc;
      reqData.transactionType = "switch";
      reqData.amount = fund.amount;
      reqData.clientCode = this.switchReq.clientCode;
      reqData.payoutMethodName = "";
      reqData.fundCode = fund.targetFundCode;
      reqData.payoutMethod = "";

      this.transactionChargesService.getTransactionCharges(reqData, (resp: TransactionChargesResp) => {
        let tranChrge = new TransactionCharge();
        tranChrge.fundTransfer = resp.fundTransfer;
        tranChrge.initialFees = resp.initialFees;
        tranChrge.totalCharges = (parseFloat(tranChrge.initialFees) + parseFloat(tranChrge.fundTransfer)).toString();
        fund.deduction = tranChrge;
        resolve(tranChrge);
      }, (error: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getTransactionCharges(fund, index);
          }
        })
      });
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
    let tncModal: Modal = this.modalCtrl.create(SwitchTncModalPage, { 'tnc': this.tnc.termAndCondition, 'nav': this.navCtrl }, options);
    tncModal.present();
  }

  proceedClicked() {
    if (!this.tnc.checked) return;
    let signupReq = new SignupReq();
    signupReq.idOptionKey = 'nationalId';
    signupReq.idValue = localStorage.getItem(LocalStorageKey.NationalID);

    this.switchReq.tnc = this.tnc;
    this.setMongoStage();
    let categoryMatrixReq = this.createCategoryMatrixRequest();
    let createSwitchOrderReq = this.createSwitchOrderRequest();
    let raiseServiceReq = this.raiseServiceRequest();
    let finalDocProcessReq = this.createFinalDocProcessRequest();

    console.log('switchReq', this.switchReq);
    this.navCtrl.push(OtpPage,
      {
        'signupData': signupReq,
        'switchReq': this.switchReq,
        'otpData': this.otpData,
        'categoryMatrixReq': categoryMatrixReq,
        'createSwitchOrderReq': createSwitchOrderReq,
        'finalDocProcessReq': finalDocProcessReq,
        'raiseServiceReq': raiseServiceReq,
        'amcMongoReq': this.amcMongoReq
      });
  }
  setMongoStage() {
    this.amcMongoReq.cp_amc_switch.stages.filter(item => {
      if (item.name == "reviewAndConfirm" || item.name == "termAndCondition") {
        item.status = MongoAMCStaging.Done;
      }
    });

    this.amcMongoReq.cp_amc_switch.termAndCondition = new TermAndCondition();
    this.amcMongoReq.cp_amc_switch.termAndCondition = this.switchReq.tnc;

    this.amcMongoStagingService.updateAmcMongoStage(this.amcMongoReq, (resp: any) => {
    });
  }

  createSwitchOrderRequest() {
    let createSwitchOrderReq = new CreateSwitchOrderReq();
    createSwitchOrderReq.clientCode = this.switchReq.clientCode;
    createSwitchOrderReq.lobSrc = this.switchReq.lobSrc;
    createSwitchOrderReq.switchOrder = this.setSwitchOrder();
    createSwitchOrderReq.tranType = "B";
    createSwitchOrderReq.transactionType = "SWI";
    return createSwitchOrderReq;
  }

  setSwitchOrder() {
    let switchList: SwitchOrder[] = [];
    this.switchReq.switchOrder.forEach((fund, i) => {
      fund.transferTo.forEach((data, j) => {
        let switchOrder = new SwitchOrder();
        switchOrder.fundCode = fund.transferFrom.fundCode;
        switchOrder.allOrPartial = "Partial";
        switchOrder.dividendOption = "R"
        switchOrder.paymentMode = "1"
        switchOrder.settlementBankCode = "0"
        switchOrder.tranUnit = "0";
        switchOrder.debitBankCode = "0"
        switchOrder.amtOrUnit = "A"
        switchOrder.targetFundCode = data.targetFundCode;
        switchOrder.tranAmt = data.amount;
        switchList.push(switchOrder);
      })
    })
    return switchList;
  }

  createCategoryMatrixRequest() {
    let categoryMatrixReq = new CategoryMatrixReq();
    categoryMatrixReq.lob = "UTF/WMF/DISCRET"
    categoryMatrixReq.action = "Switch";
    return categoryMatrixReq;
  }

  raiseServiceRequest() {
    let raiseServiceReq = new RaiseServiceRequestReq();
    raiseServiceReq.autoIncID = 'C' + Utils.autoIncID();
    raiseServiceReq.commMethod = 'Customer';
    raiseServiceReq.userDetails.idValue = localStorage.getItem(LocalStorageKey.NationalID);
    raiseServiceReq.userDetails.idType = localStorage.getItem(LocalStorageKey.NationalIDType);
    raiseServiceReq.policyNo = this.switchReq.accountNumber;
    raiseServiceReq.message = this.setSummary();

    raiseServiceReq.fileAttachment = [];
    raiseServiceReq.commMethod = "Customer";
    return raiseServiceReq;
  }

  setSummary() {
    let message: string;
    message = "NATIONAL ID=" + localStorage.getItem(LocalStorageKey.NationalID) + ",Policy Number=" + this.switchReq.accountNumber;
    this.switchReq.switchOrder.forEach((fund, i) => {
      message += ", TransferFrom=" + fund.transferFrom.fundName;
      fund.transferTo.forEach((data, j) => {
        message += ", TransferTo=" + data.targetFundName + ", TransferAmount=" + data.amount;
      })
    })
    return message;
  }

  createFinalDocProcessRequest() {
    let finalDocProcessReq = new FinalDocProcessReq();
    finalDocProcessReq.emailAddress = this.switchReq.email;
    finalDocProcessReq.customerName = this.switchReq.firstname+' '+this.switchReq.middlename+' '+this.switchReq.lastname;
    finalDocProcessReq.policyNo = this.switchReq.accountNumber;
    finalDocProcessReq.transactionType = "switch";
    finalDocProcessReq.accountNumber = this.switchReq.accountNumber;
    finalDocProcessReq.totalAmount = this.switchReq.amount;
    finalDocProcessReq.transactionNumber = this.switchReq.transactionNumber;
    finalDocProcessReq.resultCode = this.setResultCode();
    return finalDocProcessReq;
  }

  setResultCode() {
    let resultCode: Array<any> = [];
    this.switchReq.switchOrder.filter(item => {

      item.transferTo.filter(fundTo => {
        let obj = {
          amount: fundTo.amount,
          fundNameTo: fundTo.targetFundName,
          fundNameFrom: item.transferFrom.fundName
        }
        resultCode.push(obj);
      });
    });
    return JSON.stringify(resultCode);
  }

  editClicked() {
    this.navCtrl.pop();
  }

  deleteClicked() {
    let deleteMsg: string = "Do you really want to delete?";
    let titleMsg: string = "You are almost done!";
    let successBtn: string = "YES";
    let failureBtn: string = "NO";

    this.alert.Alert.confirm(deleteMsg, titleMsg, failureBtn, successBtn).then(res => {
      this.navCtrl.popTo(this.navCtrl.getByIndex(1));
    },
      error => {

      });
  }

}
