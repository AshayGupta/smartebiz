import { TransactionCharge } from './../../../../../dataModels/top-up.model';
import { UserDetails } from './../../../../../dataModels/user-details.model';
import { AmcMongoStagesReq, SwitchToFunds, AmcMongoStagesResp, AmcSwitch, SwitchFromFunds } from './../../../../../dataModels/amc-mongo-stages.model';
import { AmcMongoStagesService } from './../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';
import { GetTransactionNumberReq } from './../../../../../dataModels/get-transaction-number.model';
import { GetTransactionNumberService } from './../../../../../providers/services/main-module-services/buy-product-module-services/get-transaction-number.service';
import { SwitchVerifyPage } from './../switch-verify/switch-verify';
// import { SwitchOrder } from './../../../../../dataModels/create-switch-order.model';
import { LocalStorageKey, StatusCode, Lob, MongoAMCStaging, ClientDetailsStorageKey, SourceTag, ChannelTag, MongoSourceTag } from './../../../../../common/enums/enums';
import { Switch, SwitchList, TransferTo, TransferFrom } from './../../../../../dataModels/switch.model';
import { AmcAccountHoldingsReq, AmcAccountHoldingsResp } from './../../../../../dataModels/amc-account-holdings.model';
import { Utils } from './../../../../../common/utils/utils';
import { ClientDetailsReq, ClientDetailsResp } from './../../../../../dataModels/client-details.model';
import { AlertService } from './../../../../../providers/plugin-services/alert.service';
import { ClientDetailsService } from './../../../../../providers/services/main-module-services/product-services/client-details.service';
import { AmcAccountHoldingsService } from './../../../../../providers/services/main-module-services/product-services/amc-services/amc-tabs/amc-account-holdings.service';
import { LogonService } from './../../../../../providers/services/auth/logon.service';
import { FundsList, ActionItemsReq, ActionItemsResp } from './../../../../../dataModels/product-action-items.model';
import { AccountList } from './../../../../../dataModels/account-list.model';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, TextInput } from 'ionic-angular';
import { Stages, PolicyDetails } from '../../../../../dataModels/amc-mongo-stages.model';
import { AccountDetails } from '../../../../../dataModels/account-details.model';
import { GetProductService } from '../../../../../providers/services/main-module-services/buy-product-module-services/get-product.service';
import { HttpErrorResponse } from '@angular/common/http';


@IonicPage()
@Component({
  selector: 'page-switch',
  templateUrl: 'switch.html',
})
export class SwitchPage {

  headerTitle: string = 'Switch Funds';
  // submitAttempt: boolean = false;
  disable: boolean = true;
  switchForm: FormGroup;
  policyData: AccountList;
  switchReq: Switch = new Switch();
  fundsFromList: AccountDetails[] = [];
  productFundsList: FundsList[] = [];
  switchListArray: SwitchList[] = [];
  amcMongoReq: AmcMongoStagesReq = new AmcMongoStagesReq();
  stages: Stages[] = [
    {
      "name": "policyNumber",
      "status": MongoAMCStaging.Done
    },
    {
      "name": "switchingFund",
      "status": MongoAMCStaging.Done
    },
    {
      "name": "reviewAndConfirm",
      "status": MongoAMCStaging.Pending
    },
    {
      "name": "termAndCondition",
      "status": MongoAMCStaging.Pending
    },
    {
      "name": "otpVerification",
      "status": MongoAMCStaging.Pending
    },
    {
      "name": "SR-CREATED",
      "status": MongoAMCStaging.Pending
    }
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public logonService: LogonService,
    public amcAccountHoldingService: AmcAccountHoldingsService,
    public clientDetailsService: ClientDetailsService,
    public alert: AlertService,
    public amcMongoStagingService: AmcMongoStagesService,
    public getTransactionNumberService: GetTransactionNumberService,
    public getProductService: GetProductService
  ) {
    this.policyData = this.navParams.get('policyData');
    console.log('policyData', this.policyData);
    this.validateForm();
  }

  validateForm() {
    this.switchForm = this.formBuilder.group({
      switchFund: this.formBuilder.array([])
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SwitchPage');

    this.getFundsFromData();
    this.getProductFundsList();
    this.getTransactionNumber().then((tranNum: string) => {
      this.switchReq.transactionNumber = tranNum;
    });
    this.getClientDetails();
  }

  getClientDetails() {
    let reqData = new ClientDetailsReq();
    reqData.nationalIdNumber = this.policyData.idDocumentNumber;
    reqData.lobSrc = Utils.getLobID(this.policyData.lobSrc);

    this.clientDetailsService.getClientDetails(reqData, (resp: ClientDetailsResp) => {
      this.switchReq.firstname = resp.firstName;
      this.switchReq.middlename = resp.middleName;
      this.switchReq.lastname = resp.surname;
      this.switchReq.phoneNumber = localStorage.getItem(ClientDetailsStorageKey.PhoneNumber);
      this.switchReq.email = localStorage.getItem(ClientDetailsStorageKey.Email);
      this.switchReq.accountNumber = this.policyData.accountNumber;//"BA02600";
      this.switchReq.lobSrc = Utils.getLobID(this.policyData.lobSrc);
      this.switchReq.userDetails = new UserDetails();
      this.switchReq.userDetails.idType = localStorage.getItem(LocalStorageKey.NationalIDType);
      this.switchReq.userDetails.idValue = localStorage.getItem(LocalStorageKey.NationalID);
      this.switchReq.dateOfBirth = resp.dateOfBirth;
      this.switchReq.gender = resp.gender;
      this.switchReq.nationality = resp.nationality;
      this.switchReq.occupation = resp.occupation;
      this.switchReq.personStatus = resp.personStatus;
      this.switchReq.pinNumber = resp.pinNumber;
      this.switchReq.salutation = resp.salutation;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getClientDetails();
          }
        })
      });
  }

  getTransactionNumber() {
    return new Promise((resolve, reject) => {
      let req = new GetTransactionNumberReq();
      req.transactionType = "amcSwitch";
      req.policyNumber = this.policyData.accountNumber;

      this.getTransactionNumberService.getTransactionNumber(req, (resp) => {
        resolve(resp.transactionNumber);
      })
    });
  }

  getProductFundsList() {
    let reqData = new ActionItemsReq();
    reqData.lobSrc = Utils.getLobID(this.policyData.lobSrc);

    this.getProductService.getProduct(reqData, (resp: ActionItemsResp) => {
      this.productFundsList = resp.fundsList;
    }, (err: HttpErrorResponse) => {
      this.logonService.getToken((isTokenValid: boolean) => {
        if (isTokenValid) {
          this.getProductFundsList();
        }
      })
    });
  }

  getFundsFromData() {
    let reqData = new AmcAccountHoldingsReq();
    reqData.accountNumber = this.policyData.accountNumber;//"BA02600";
    reqData.formatted = false;

    this.amcAccountHoldingService.getHoldings(reqData, (resp: AmcAccountHoldingsResp) => {
      this.fundsFromList = resp.amcFunds;
      this.switchReq.clientCode = resp.amcFunds[0].accountCode;
      this.initForm();
    }, (err) => {
      if (err.status == StatusCode.Status403) {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getFundsFromData();
          }
        })
      }
    })
  }

  initForm() {
    for (var i = 0; i < this.fundsFromList.length; i++) {
      this.addFundsForm(i, true);
    }
  }

  addFundsForm(i: number, addMore: boolean) {
    if (addMore) {
      const formArray = this.formBuilder.group({
        transferToArr: this.formBuilder.array([]),
      });

      (<FormArray>this.switchForm.get('switchFund')).push(formArray);
    }

    const form = this.formBuilder.group({
      transferFundList: ['', Validators.compose([
        // Validators.required
      ])],
      transferAmount: ['', Validators.compose([
        // Validators.required,
        // Validators.max(parseFloat(this.fundsFromList[i].marketValue)),
      ])],
    });

    (<FormArray>this.switchForm.get('switchFund')).controls[i]["controls"].transferToArr.push(form);

    console.log('addFundsForm ->', this.switchForm);
  }

  plusClicked(i: number, j: number, data: FundsList) {
    this.addFundsForm(i, false);
  }

  removeFundClicked(i: number, j: number) {
    (<FormArray>this.switchForm.get('switchFund')).controls[i]["controls"].transferToArr.removeAt(j);
    this.addValidations(i, j);
  }

  selectFund(i: number, j: number) {
    this.addValidations(i, j);
  }

  enterAmount(i: number, j: number) {
    this.addValidations(i, j);
  }

  addValidations(i: number, j: number) {
    let switchFund = (<FormArray>this.switchForm.get('switchFund'));
    let transferToArr = switchFund.controls[i].value.transferToArr;

    let sum: number = 0;
    this.disable = false;
    transferToArr.filter(item => {
      // For set validation 
      if (Utils.isEmpty(item.transferAmount) || Utils.isEmpty(item.transferFundList)) {
        this.disable = true;
        let ctrl = (<FormArray>(<FormArray>switchFund.controls[i].get('transferToArr')).controls[j]);
        ctrl.get('transferAmount').setValidators([
          Validators.required,
          Validators.max(parseFloat(this.fundsFromList[i].marketValue)),
          Validators.min(parseFloat(item.transferFundList.minInvestmentAmnt))
        ]);
        ctrl.get('transferFundList').setValidators([
          Validators.required,
        ])
        ctrl.updateValueAndValidity();
      }

      // For Calculate sum
      sum += parseFloat(item.transferAmount);

      if (sum > parseFloat(this.fundsFromList[i].marketValue)) {
        console.log('enterAmount sum ->', sum);
        this.fundsFromList[i].disableFund = true;
        this.disable = true;
      }
      else {
        this.fundsFromList[i].disableFund = false;
      }
    });
  }

  disableTransferTo(i: number, k: number) {
    let switchFund = (<FormArray>this.switchForm.get('switchFund'));
    let transferToArr = (<FormArray>switchFund.controls[i].get('transferToArr'))

    for (var y = 0; y < transferToArr.length; y++) {
      let value = ((<FormArray>transferToArr).controls[y]["controls"].transferFundList.value.productCode);
      if (this.productFundsList[k].productCode == value) {
        return true;
      }
    }
  }

  proceedClicked() {
    this.switchListArray = [];
    console.log('switchForm ->', this.switchForm);

    let switchFund = (<FormArray>this.switchForm.get('switchFund'));

    for (let i = 0; i < switchFund.length; i++) {
      let transferToArr = switchFund.controls[i].value.transferToArr;
      console.log('transferToArr ->', transferToArr);

      let switchList = new SwitchList();
      switchList.transferFrom = new TransferFrom();
      switchList.transferTo = [];

      switchList.transferFrom.fundName = this.fundsFromList[i].schemeName;
      switchList.transferFrom.fundCode = this.fundsFromList[i].productCode;
      switchList.transferFrom.amount = this.fundsFromList[i].marketValue;

      for (let j = 0; j < transferToArr.length; j++) {
        if (!Utils.isEmpty(transferToArr[j].transferAmount) || !Utils.isEmpty(transferToArr[j].transferFundList)) {

          let toObj = new TransferTo();
          toObj.targetFundCode = transferToArr[j].transferFundList.productCode;
          toObj.targetFundName = transferToArr[j].transferFundList.productName;
          toObj.amount = transferToArr[j].transferAmount;
          toObj.deduction = new TransactionCharge();
          switchList.transferTo.push(toObj);
        }
      }

      if (switchList.transferTo.length > 0) {
        this.switchListArray.push(switchList);
      }
    }

    console.log('proceedClicked switchList ->', this.switchListArray);

    if (this.switchListArray.length > 0) {
      this.switchReq.switchOrder = this.switchListArray;
      this.setMontoStages();

      this.navCtrl.push(SwitchVerifyPage, {
        "switchReq": this.switchReq,
        "amcMongoReq": this.amcMongoReq
      });
    }

  }


  setMontoStages() {
    let policyDetails = new PolicyDetails();
    policyDetails.accountNumber = this.switchReq.accountNumber;
    policyDetails.lobSrc = this.switchReq.lobSrc;

    this.amcMongoReq.cp_amc_switch = new AmcSwitch();
    this.amcMongoReq.collection = "cp_amc_switch";
    this.amcMongoReq.cp_amc_switch.source = MongoSourceTag.MOBILEAPP;
    this.amcMongoReq.cp_amc_switch.channel = ChannelTag.MOBILE;
    this.amcMongoReq.cp_amc_switch.TargetLob = "AMC";
    this.amcMongoReq.cp_amc_switch.transactionId = 'TR_' + Utils.autoIncID();
    this.amcMongoReq.cp_amc_switch.policyDetails = policyDetails;
    this.amcMongoReq.cp_amc_switch.stages = this.stages;
    this.amcMongoReq.cp_amc_switch.userDetails = this.switchReq.userDetails;
    this.amcMongoReq.cp_amc_switch.switchFromFunds = this.setSwitchFromFunds();
    this.amcMongoReq.cp_amc_switch.switchToFunds = this.setSwitchToFunds();

    this.amcMongoStagingService.createAmcMongoStage(this.amcMongoReq, (resp: AmcMongoStagesResp) => {
      this.amcMongoReq.mongoId = resp.id;
    });
  }

  setSwitchToFunds() {
    let swtToFund: SwitchToFunds[] = [];
    this.switchReq.switchOrder.forEach((funds, i) => {
      funds.transferTo.forEach((data, j) => {
        let switchToFunds = new SwitchToFunds();
        switchToFunds.fundCode = data.targetFundCode;
        switchToFunds.fundName = data.targetFundName;
        switchToFunds.amount = data.amount;
        swtToFund.push(switchToFunds);
      });
    });
    return swtToFund;
  }

  setSwitchFromFunds() {
    let swtFromFund: SwitchFromFunds[] = [];
    this.switchReq.switchOrder.forEach((funds, i) => {
      let switchFromFunds = new SwitchFromFunds();
      switchFromFunds.fundCode = funds.transferFrom.fundCode;
      switchFromFunds.fundName = funds.transferFrom.fundName;
      // switchFromFunds.amount = funds.transferFrom.amount;
      switchFromFunds.amount = funds.transferTo[i].amount;
      swtFromFund.push(switchFromFunds);
    });
    return swtFromFund;
  }
}
