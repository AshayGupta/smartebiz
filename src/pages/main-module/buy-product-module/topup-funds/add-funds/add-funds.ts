import { HtmlContentService } from './../../../../../providers/services/common-pages/html-content.service';
import { HtmlContentReq, HtmlContentResp } from './../../../../../dataModels/html-content.model';
import { TopUpTncModalPage } from './../top-up-tnc-modal/top-up-tnc-modal';
import { GetTransactionNumberReq } from './../../../../../dataModels/get-transaction-number.model';
import { GetTransactionNumberService } from './../../../../../providers/services/main-module-services/buy-product-module-services/get-transaction-number.service';
import { Stages, AmcMongoStagesResp, TermAndCondition } from './../../../../../dataModels/amc-mongo-stages.model';
import { AmcMongoStagesService } from './../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';
import { AlertService } from './../../../../../providers/plugin-services/alert.service';
import { AlertInterface } from './../../../../../common/interfaces/alert.interface';
import { LocalStorageKey, SourceTag, StatusCode, ClientDetailsStorageKey, MongoAMCStaging, ChannelTag, MongoSourceTag } from './../../../../../common/enums/enums';
import { ClientDetailsReq, ClientDetailsResp } from './../../../../../dataModels/client-details.model';
import { ClientDetailsService } from './../../../../../providers/services/main-module-services/product-services/client-details.service';
import { Utils } from './../../../../../common/utils/utils';
import { TopupPaymentMethodPage } from './../topup-payment-method/topup-payment-method';
import { HttpErrorResponse } from '@angular/common/http';
import { ActionItemsReq, ActionItemsResp, FundsList } from './../../../../../dataModels/product-action-items.model';
import { GetProductService } from './../../../../../providers/services/main-module-services/buy-product-module-services/get-product.service';
import { TopUpReq } from './../../../../../dataModels/top-up.model';
import { RegexPattern } from './../../../../../common/constants/constants';
import { AmcAccountHoldingsService } from './../../../../../providers/services/main-module-services/product-services/amc-services/amc-tabs/amc-account-holdings.service';
import { AmcAccountHoldingsReq, AmcAccountHoldingsResp } from './../../../../../dataModels/amc-account-holdings.model';
import { LogonService } from './../../../../../providers/services/auth/logon.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AccountList } from './../../../../../dataModels/account-list.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Modal, ModalController } from 'ionic-angular';
import { PostedAmounts } from '../../../../../dataModels/make-payment.model';
import { UserDetails } from '../../../../../dataModels/user-details.model';
import { AmcMongoStagesReq, AmcTopUp } from '../../../../../dataModels/amc-mongo-stages.model';


@IonicPage()
@Component({
  selector: 'page-add-funds',
  templateUrl: 'add-funds.html',
})
export class AddFundsPage {

  topUpForm: FormGroup;
  policyData: AccountList;
  submitAttempt: boolean = false;
  headerTitle: string = 'Top Up';
  amount: number = 0.00;
  topUpReq: TopUpReq = new TopUpReq();
  fundList: FundsList[] = [];
  otherFundList: FundsList[] = [];
  investMore: boolean = false;
  investIn: boolean = true;
  tnc = new TermAndCondition();
  amcMongoReq = new AmcMongoStagesReq();
  mongoStages: Stages[] = [{
    name: "topup",
    status: MongoAMCStaging.Done
  },
  {
    name: "paymentModeScreen",
    status: MongoAMCStaging.Pending
  }
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public logonService: LogonService,
    public amcAccountHoldingService: AmcAccountHoldingsService,
    public clientDetailsService: ClientDetailsService,
    public getProductService: GetProductService,
    public AmcMongoStageService: AmcMongoStagesService,
    public getTransactionNumberService: GetTransactionNumberService,
    public htmlContentService: HtmlContentService,
    public alert: AlertService,
    public modalCtrl: ModalController,
  ) {
    this.policyData = this.navParams.get('policyData');
    this.topUpReq.postedAmount = [];
    this.topUpReq.userDetails = new UserDetails();
    console.log('policyData', this.policyData);
    this.validateForm();
  }

  validateForm() {
    this.topUpForm = this.formBuilder.group({
      fundAmount: this.formBuilder.array([]),
      otherFund: this.formBuilder.array([])
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddFundsPage');
    this.tnc.checked = false;
    this.openTnC();
    this.getClientDetails();
    this.getTransactionNumber().then((tranNum: string) => {
      this.topUpReq.transactionNumber = tranNum;
    });
  }
  getClientDetails() {
    let reqData = new ClientDetailsReq();
    reqData.nationalIdNumber = this.policyData.idDocumentNumber;
    reqData.lobSrc = Utils.getLobID(this.policyData.lobSrc);

    this.clientDetailsService.getClientDetails(reqData, (resp: ClientDetailsResp) => {
      this.topUpReq.firstname = resp.firstName;
      this.topUpReq.middlename = resp.middleName;
      this.topUpReq.lastname = resp.surname;
      this.topUpReq.PhoneNumber = localStorage.getItem(ClientDetailsStorageKey.PhoneNumber);
      this.topUpReq.email = localStorage.getItem(ClientDetailsStorageKey.Email);
      this.topUpReq.accountNumber = this.policyData.accountNumber;//"BA02600";
      this.topUpReq.lobSrc = Utils.getLobID(this.policyData.lobSrc);
      this.topUpReq.userDetails.idType = localStorage.getItem(LocalStorageKey.NationalIDType);
      this.topUpReq.userDetails.idValue = this.policyData.idDocumentNumber;

      this.getFunds();
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getClientDetails();
          }
        })
      });
  }

  getFunds() {
    let reqData = new AmcAccountHoldingsReq();
    reqData.accountNumber = this.policyData.accountNumber;//"BA02600";
    reqData.formatted=false;
    this.amcAccountHoldingService.getHoldings(reqData, (resp: AmcAccountHoldingsResp) => {
      resp.amcFunds.forEach((data) => {
        let fund = new FundsList();
        fund.productCode = data.productCode;
        fund.productName = data.schemeName;
        fund.currentHoldingValue = data.marketValue;
        fund.accountCode = data.accountCode;
        this.fundList.push(fund);
      });
      this.getMinInvestmentAmt();
    }, (err) => {
      if (err.status == StatusCode.Status403) {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getFunds();
          }
        })
      }
    })
  }

  getMinInvestmentAmt() {
    let reqData = new ActionItemsReq();
    reqData.lobSrc = this.topUpReq.lobSrc;

    this.getProductService.getProduct(reqData, (resp: ActionItemsResp) => {
      resp.fundsList.forEach(data => {
        this.fundList.forEach((fund, i) => {
          if (data.productCode == fund.productCode) {
            this.fundList[i].minInvestmentAmnt = data.minInvestmentAmnt;
            this.fundList[i].productOrdering=data.productOrdering;
          }
        })
      });
      this.otherFundList = resp.fundsList.filter(data => {
        return !this.fundList.some(fund => {
          return data.productCode === fund.productCode;
        })
      });
      this.fundList.sort(function (a, b) { return parseInt(a.productOrdering) > parseInt(b.productOrdering) ? 1 : -1; });
      this.otherFundList.sort(function (a, b) { return parseInt(a.productOrdering) > parseInt(b.productOrdering) ? 1 : -1; });
      this.addFundsForm();
      console.log("this.fundList===>", this.fundList);
      console.log("this.otherFundList===>", this.otherFundList);
    }, (err: HttpErrorResponse) => {
      this.logonService.getToken((isTokenValid: boolean) => {
        if (isTokenValid) {
          this.getMinInvestmentAmt();
        }
      })
    });
  }

  addFundsForm() {
    for (var i = 0; i < this.fundList.length; i++) {
      const fundsForm = this.formBuilder.group({
        topUpAmount: ['', Validators.compose([Validators.min(parseInt(this.fundList[i].minInvestmentAmnt)), Validators.pattern(RegexPattern.onlyContainNumbers)])]
      });
      (<FormArray>this.topUpForm.controls.fundAmount).push(fundsForm);
    }

    //otherFundList
    for (var j = 0; j < this.otherFundList.length; j++) {
      const othersForm = this.formBuilder.group({
        otherTopUp: ['', Validators.compose([Validators.min(parseInt(this.otherFundList[j].minInvestmentAmnt)), Validators.pattern(RegexPattern.onlyContainNumbers)])]
      });
      (<FormArray>this.topUpForm.controls.otherFund).push(othersForm);
    }
  }

  getTransactionNumber() {
    return new Promise((resolve, reject) => {
      let req = new GetTransactionNumberReq();
      req.transactionType = "topup";
      req.policyNumber = this.policyData.accountNumber;

      this.getTransactionNumberService.getTransactionNumber(req, (resp) => {
        resolve(resp.transactionNumber);
      })
    });
  }

  calculateAmount() {
    let totalAmount = 0.00;

    for (let control of this.topUpForm.get('fundAmount')['controls']) {
      let fundAmount = control.controls.topUpAmount.value;
      if (fundAmount != "") {
        this.investIn = false;
        totalAmount += fundAmount ? parseFloat(fundAmount) : 0.00;
      }
    }

    for (let control of this.topUpForm.get('otherFund')['controls']) {
      let otherAmount = control.controls.otherTopUp.value;
      if (otherAmount != "") {
        this.investIn = false;
        totalAmount += otherAmount ? parseFloat(otherAmount) : 0.00;
      }
    }

    this.amount = totalAmount;
    console.log('this.amount==' + this.amount);
  }

  wantInvestMore() {
    this.investMore = true;
    console.log("Yes.==>", this.investMore)
  }

  openTnC() {
    let htmlReq = new HtmlContentReq();
    htmlReq.contentType = 'amc topup';

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
    if(!this.tnc.termAndCondition){
      this.tnc.termAndCondition="terms and conditions not found."
    }
    let options = {
      showBackdrop: true,
      enableBackdropDismiss: true,
    };
    let tncModal: Modal = this.modalCtrl.create(TopUpTncModalPage, { 'tnc': this.tnc.termAndCondition, 'nav': this.navCtrl }, options);
    tncModal.present();
  }

  proceedClicked() {
    if (!this.tnc.checked) return;
    if (this.investIn) {
      this.investInOneFundAlert();
      return
    }

    if (!this.topUpForm.valid) {
      this.submitAttempt = true;
      return;
    }
    this.topUpReq.tnc = this.tnc;
    this.topUpReq.amount = this.amount.toString();
    this.getPostedAmount();

    this.createMongoStage();

    let options = {
      showBackdrop: true,
      enableBackdropDismiss: true,
    };
    let paynowModal: Modal = this.modalCtrl.create(TopupPaymentMethodPage, { 'topUpReq': this.topUpReq, 'amcMongoReq': this.amcMongoReq, 'nav': this.navCtrl }, options);
    paynowModal.present();
  }

  getPostedAmount() {
    let index = 0;

    for (let control of this.topUpForm.get('fundAmount')['controls']) {
      let fundAmount = control.controls.topUpAmount.value;
      if (fundAmount != "") {
        this.pushIntoPostedAmount(fundAmount, index, this.fundList);
      }
      index++;
    }

    let index1 = 0;
    for (let control of this.topUpForm.get('otherFund')['controls']) {
      let otherAmount = control.controls.otherTopUp.value;
      if (otherAmount != "") {
        this.pushIntoPostedAmount(otherAmount, index1, this.otherFundList);
      }
      index1++;
    }
  }

  pushIntoPostedAmount(fundAmount, index, amcFunds: FundsList[]) {
    let fund = new PostedAmounts();
    fund.fundCode = amcFunds[index].productCode;
    fund.fundName = amcFunds[index].productName;
    fund.clientCode = this.fundList[0].accountCode//amcFunds[index].accountCode;
    fund.amount = fundAmount;
    fund.transactionType = "Top-up"
    fund.currentHoldingValue = amcFunds[index].currentHoldingValue == undefined ? "0" : amcFunds[index].currentHoldingValue;
    fund.accountNumber = this.policyData.accountNumber;
    this.topUpReq.postedAmount.forEach((data, i) => {
      if (data.fundCode == amcFunds[index].productCode) {
        this.topUpReq.postedAmount.splice(i, 1);
      }
    })
    this.topUpReq.postedAmount.push(fund);
  }

  investInOneFundAlert() {
    let alertData: AlertInterface = {
      title: "",
      message: "Please invest in at least one fund to proceed.",
      cancelText: "OK",
    };
    this.alert.Alert.alert(alertData.message, alertData.title);
  }

  createMongoStage() {
    this.amcMongoReq.amcTopUp["stages"] = this.mongoStages;

    this.amcMongoReq.amcTopUp["collection"] = "cp_amc_topUp";
    this.amcMongoReq.amcTopUp["source"] = MongoSourceTag.MOBILEAPP;
    this.amcMongoReq.amcTopUp["channel"] = ChannelTag.MOBILE;
    this.amcMongoReq.amcTopUp["TargetLob"] = "AMC",
    this.amcMongoReq.amcTopUp["transactionId"] = 'TR_' + Utils.autoIncID();
    this.amcMongoReq.amcTopUp["userDetails"] = this.topUpReq.userDetails;
    this.amcMongoReq.amcTopUp["personalVerification"] = this.topUpReq.userDetails;
    this.amcMongoReq.amcTopUp["Mobile"] = localStorage.getItem(ClientDetailsStorageKey.PhoneNumber);

    this.amcMongoReq.amcTopUp["fund"] = [];
    this.topUpReq.postedAmount.filter(item => {
      let obj = {};
      obj["amount"] = item.amount;
      obj["accountCode"] = item.clientCode;
      obj["currentHoldingValue"] = item.currentHoldingValue;
      obj["fundCode"] = item.fundCode;
      obj["fundName"] = item.fundName;
      obj["accountNumber"] = item.accountNumber;
      this.amcMongoReq.amcTopUp["fund"].push(obj);
    })

    this.AmcMongoStageService.createAmcMongoStage(this.amcMongoReq.amcTopUp, (resp: AmcMongoStagesResp) => {
      this.amcMongoReq.amcTopUp["mongoId"] = resp.id;
    })
  }
}
