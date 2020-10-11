import { PendingOrdersReq, PendingOrdersResp } from './../../../../../dataModels/pending-orders.model';
import { PendingOrdersService } from './../../../../../providers/services/main-module-services/buy-product-module-services/get-pending-oders.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AmcMongoStagesService } from './../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';
import { Stages, AmcMongoStagesResp, FundDetails } from './../../../../../dataModels/amc-mongo-stages.model';
import { GetTransactionNumberService } from './../../../../../providers/services/main-module-services/buy-product-module-services/get-transaction-number.service';
import { GetTransactionNumberReq } from './../../../../../dataModels/get-transaction-number.model';
import { LocalStorageKey, StatusCode, ClientDetailsStorageKey, SourceTag, MongoAMCStaging, ChannelTag, MongoSourceTag } from './../../../../../common/enums/enums';
import { AlertInterface } from './../../../../../common/interfaces/alert.interface';
import { PostedAmounts } from './../../../../../dataModels/make-payment.model';
import { TopUpReq } from './../../../../../dataModels/top-up.model';
import { RegexPattern } from './../../../../../common/constants/constants';
import { Utils } from './../../../../../common/utils/utils';
import { ClientDetailsReq, ClientDetailsResp } from './../../../../../dataModels/client-details.model';
import { AmcAccountHoldingsReq, AmcAccountHoldingsResp } from './../../../../../dataModels/amc-account-holdings.model';
import { AccountList } from './../../../../../dataModels/account-list.model';
import { FundsList, ActionItemsReq, ActionItemsResp } from './../../../../../dataModels/product-action-items.model';
import { AlertService } from './../../../../../providers/plugin-services/alert.service';
import { GetProductService } from './../../../../../providers/services/main-module-services/buy-product-module-services/get-product.service';
import { ClientDetailsService } from './../../../../../providers/services/main-module-services/product-services/client-details.service';
import { AmcAccountHoldingsService } from './../../../../../providers/services/main-module-services/product-services/amc-services/amc-tabs/amc-account-holdings.service';
import { LogonService } from './../../../../../providers/services/auth/logon.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WithdrawPayoutPage } from '../withdraw-payout/withdraw-payout';
import { UserDetails } from '../../../../../dataModels/user-details.model';
import { AmcMongoStagesReq, AmcWithdraw, PolicyDetails, PartialRequestDetails } from '../../../../../dataModels/amc-mongo-stages.model';
import { TransactionChargesResp } from '../../../../../dataModels/transaction-charges.model';

@IonicPage()
@Component({
  selector: 'page-withdraw',
  templateUrl: 'withdraw.html',
})
export class WithdrawPage {

  withdrawForm: FormGroup;
  policyData: AccountList;
  submitAttempt: boolean = false;
  headerTitle: string = 'Withdraw';
  amount: number = 0.00;
  withdrawReq: TopUpReq = new TopUpReq();
  fundList: FundsList[] = [];
  // otherFundList: FundsList[] = [];
  withdraw: boolean = false;
  currentValue: number = 0.00;
  isPending: boolean = false;
  amcMongoReq: AmcMongoStagesReq = new AmcMongoStagesReq();
  stages: Stages[] = [{
    name: "Selection of Amount",
    status: MongoAMCStaging.Done,
  },
  {
    name: "Bank Details Add",
    status: MongoAMCStaging.Pending
  },
  {
    name: "OTP Verified",
    status: MongoAMCStaging.Pending
  },
  {
    name: "SR-CREATED",
    status: MongoAMCStaging.Pending
  }];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public logonService: LogonService,
    public amcAccountHoldingService: AmcAccountHoldingsService,
    public clientDetailsService: ClientDetailsService,
    public getTransactionNumberService: GetTransactionNumberService,
    public getProductService: GetProductService,
    public alert: AlertService,
    public pendingOrdersService: PendingOrdersService,
    public amcMongoStageService: AmcMongoStagesService
  ) {
    this.withdrawReq.postedAmount = [];
    this.policyData = this.navParams.get('policyData');
    console.log('policyData', this.policyData);

    this.setupPage();
    this.validateForm();
  }

  validateForm() {
    this.withdrawForm = this.formBuilder.group({
      withdrawAmount: this.formBuilder.array([])
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WithdrawPage');
    this.getFunds();
    this.getTransactionNumber().then((tranNum: string) => {
      this.withdrawReq.transactionNumber = tranNum;
    });
    this.getClientDetails();
  }

  setupPage() {
    this.withdrawReq.userDetails = new UserDetails();

    this.withdrawReq.accountNumber = this.policyData.accountNumber;//"BA02600";
    this.withdrawReq.lobSrc = Utils.getLobID(this.policyData.lobSrc);
    this.withdrawReq.PhoneNumber = localStorage.getItem(ClientDetailsStorageKey.PhoneNumber);
    this.withdrawReq.email = localStorage.getItem(ClientDetailsStorageKey.Email);
    this.withdrawReq.userDetails.idType = localStorage.getItem(LocalStorageKey.NationalIDType);
    this.withdrawReq.userDetails.idValue = localStorage.getItem(LocalStorageKey.NationalID);
  }

  getClientDetails() {
    let reqData = new ClientDetailsReq();
    reqData.nationalIdNumber = this.policyData.idDocumentNumber;
    reqData.lobSrc = this.withdrawReq.lobSrc;

    this.clientDetailsService.getClientDetails(reqData, (resp: ClientDetailsResp) => {
      this.withdrawReq.firstname = resp.firstName;
      this.withdrawReq.middlename = resp.middleName;
      this.withdrawReq.lastname = resp.surname;
      this.withdrawReq.dateOfBirth = resp.dateOfBirth;
      this.withdrawReq.gender = resp.gender;
      this.withdrawReq.nationality = resp.nationality;
      this.withdrawReq.occupation = resp.occupation;
      this.withdrawReq.personStatus = resp.personStatus;
      this.withdrawReq.pinNumber = resp.pinNumber;
      this.withdrawReq.salutation = resp.salutation;
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
    reqData.accountNumber = this.withdrawReq.accountNumber;
    reqData.formatted = false;

    this.amcAccountHoldingService.getHoldings(reqData, (resp: AmcAccountHoldingsResp) => {
      resp.amcFunds.forEach((data, i) => {
        let fund = new FundsList();
        fund.productCode = data.productCode;
        fund.productName = data.schemeName;
        fund.currentHoldingValue = data.marketValue;
        fund.accountCode = data.accountCode;
        fund.disableFund = true; // change it
        // fund.pendingAmount = '5000'; //remove
        // fund.minWithdrawalAmnt = '1000'; //remove
        this.fundList.push(fund);
        this.addFundsForm();
        // this.addValidations(i, this.fundList); //remove
      });
      this.fundList.sort(function (a, b) { return parseInt(a.productOrdering) > parseInt(b.productOrdering) ? 1 : -1; });

      this.withdrawReq.maximumAmount = this.getAvailableBalance().toString();
      this.getPendingOrders();

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

  addFundsForm() {
    const form = this.formBuilder.group({
      amount: ['', Validators.compose([
      ])]
    });
    (<FormArray>this.withdrawForm.controls.withdrawAmount).push(form);
    console.log('Withdrawal form ->', this.withdrawForm);
  }

  getAvailableBalance() {
    let sum = 0.00;
    this.fundList.forEach(data => {
      sum += parseFloat(data.currentHoldingValue)
    })
    return sum;
  }

  getPendingOrders() {
    let promises = [];
    this.fundList.forEach((data, i) => {
      let promise = this.pendingOrders(data.productCode, i).then((amount: string) => {
        this.fundList[i].pendingAmount = amount;
        if (!Utils.isEmpty(amount)) {
          this.fundList[i].disableFund = false;
          this.addValidations(i, this.fundList);
        }
        else {
          this.fundList[i].disableFund = true;
        }
      });
      promises.push(promise);
    });
    Promise.all(promises).then(() => {
      this.getMinInvestmentAmt()
    });
  }

  pendingOrders(productCode: string, index?: number) {
    return new Promise((resolve, reject) => {
      let reqData = new PendingOrdersReq();
      reqData.lobSrc = this.withdrawReq.lobSrc;
      reqData.accountNumber = this.withdrawReq.accountNumber;
      reqData.fundCode = productCode;

      this.pendingOrdersService.getPendingOrder(reqData, (resp: PendingOrdersResp) => {
        resolve(resp.orderAmount);
      },
        (err: boolean) => {
          this.logonService.getToken((isTokenValid: boolean) => {
            if (isTokenValid) {
              this.pendingOrders(productCode);
            }
          })
          reject(err);
        });
    })
  }

  getMinInvestmentAmt() {
    let reqData = new ActionItemsReq();
    reqData.lobSrc = this.withdrawReq.lobSrc;

    this.getProductService.getProduct(reqData, (resp: ActionItemsResp) => {
      resp.fundsList.forEach(data => {
        this.fundList.forEach((fund, i) => {
          if (data.productCode == fund.productCode) {
            this.fundList[i].minWithdrawalAmnt = data.minWithdrawalAmnt;

            if (Utils.isEmpty(data.minWithdrawalAmnt)) {
              this.fundList[i].disableFund = true;
            }
            else {
              this.addValidations(i, this.fundList);
            }
          }
        })
      });
      console.log("this.fundList===>", this.fundList);

    }, (err: HttpErrorResponse) => {
      this.logonService.getToken((isTokenValid: boolean) => {
        if (isTokenValid) {
          this.getMinInvestmentAmt();
        }
      })
    });
  }

  addValidations(index: number, fundList: FundsList[]) {
    let currentValue = parseFloat(fundList[index].currentHoldingValue) - parseFloat(fundList[index].pendingAmount);

    let ctrl = (<FormArray>this.withdrawForm.get('withdrawAmount')).controls[index].get('amount');
    ctrl.setValidators([
      // Validators.required,
      Validators.max(currentValue),
      Validators.min(parseFloat(fundList[index].minWithdrawalAmnt))
    ]);
    ctrl.updateValueAndValidity();
    console.log('addValidations ->', this.withdrawForm);
  }

  getTransactionNumber() {
    return new Promise((resolve, reject) => {
      let req = new GetTransactionNumberReq();
      req.transactionType = "amcWithdrawal";
      req.policyNumber = this.withdrawReq.accountNumber;

      this.getTransactionNumberService.getTransactionNumber(req, (resp) => {
        resolve(resp.transactionNumber);
      })
    });
  }

  calculateAmount() {
    let totalAmount = 0.00;

    for (let control of this.withdrawForm.get('withdrawAmount')['controls']) {
      let fundAmount = control.controls.amount.value;
      if (fundAmount != "" && fundAmount != "0") {
        totalAmount += fundAmount ? parseFloat(fundAmount) : 0.00;
      }
    }

    this.amount = totalAmount;
    console.log('this.amount==' + this.amount);
  }

  proceedClicked() {
    if (!this.withdrawForm.valid) {
      return;
    }
    this.withdrawReq.postedAmount = [];
    this.getPostedAmount();

    if (!this.withdraw || this.amount == 0) {
      this.investInOneFundAlert();
      return
    }
    this.withdraw = false;
    this.withdrawReq.amount = this.amount.toString();
    this.createMongoStage();
    console.log("withdrawReq=>", this.withdrawReq);
    this.navCtrl.push(WithdrawPayoutPage, { 'withdrawReq': this.withdrawReq, 'amcMongoReq': this.amcMongoReq });
  }

  getPostedAmount() {
    let index = 0;

    for (let control of this.withdrawForm.get('withdrawAmount')['controls']) {
      let fundAmount = control.controls.amount.value;
      if (fundAmount != "" && fundAmount != "0") {
        this.withdraw = true;
        this.pushIntoPostedAmount(fundAmount, index);
      }
      index++;
    }
  }

  pushIntoPostedAmount(fundAmount, index) {
    let fund = new PostedAmounts();
    fund.fundCode = this.fundList[index].productCode;
    fund.fundName = this.fundList[index].productName;
    fund.amount = fundAmount;
    fund.clientCode = this.fundList[index].accountCode;
    fund.accountNumber = this.withdrawReq.accountNumber;
    fund.transactionType = "Withdrawal";
    fund.currentHoldingValue = this.fundList[index].currentHoldingValue;
    fund.deduction = new TransactionChargesResp();
    this.withdrawReq.postedAmount.forEach((data, i) => {
      if (data.fundCode == this.fundList[index].productCode) {
        this.withdrawReq.postedAmount.splice(i, 1);
      }
    })
    this.withdrawReq.postedAmount.push(fund);
  }

  investInOneFundAlert() {
    let alertData: AlertInterface = {
      title: "Required",
      message: "Please withdraw valid amount to proceed.",
      cancelText: "OK",
    };
    this.alert.Alert.alert(alertData.message, alertData.title);
  }

  createMongoStage() {
    this.amcMongoReq.collection = "cp_amc_withdrawal";
    this.amcMongoReq.cp_amc_withdrawal = new AmcWithdraw();
    this.amcMongoReq.cp_amc_withdrawal.source = MongoSourceTag.MOBILEAPP;
    this.amcMongoReq.cp_amc_withdrawal.channel = ChannelTag.MOBILE;
    
    this.amcMongoReq.cp_amc_withdrawal.TargetLob = "AMC";
    this.amcMongoReq.cp_amc_withdrawal.transactionId = 'TR_' + Utils.autoIncID();

    this.amcMongoReq.cp_amc_withdrawal.userDetails = new UserDetails();
    this.amcMongoReq.cp_amc_withdrawal.userDetails.idType = localStorage.getItem(LocalStorageKey.NationalIDType);
    this.amcMongoReq.cp_amc_withdrawal.userDetails.idValue = localStorage.getItem(LocalStorageKey.NationalID);
    
    this.amcMongoReq.cp_amc_withdrawal.policyDetails = new PolicyDetails();
    this.amcMongoReq.cp_amc_withdrawal.policyDetails.accountNumber = this.withdrawReq.accountNumber;
    this.amcMongoReq.cp_amc_withdrawal.policyDetails.lobSrc = this.withdrawReq.lobSrc;
    
    this.amcMongoReq.cp_amc_withdrawal.partialRequestDetails = new PartialRequestDetails();
    this.setFundDetails();
    this.amcMongoReq.cp_amc_withdrawal.partialRequestDetails.maximumAmount = this.withdrawReq.maximumAmount;
    this.amcMongoReq.cp_amc_withdrawal.partialRequestDetails.withDrawalAmount = this.withdrawReq.amount;
    
    this.amcMongoReq.cp_amc_withdrawal.transactionNumber = this.withdrawReq.transactionNumber;
    this.amcMongoReq.cp_amc_withdrawal.stages = this.stages;

    this.amcMongoStageService.createAmcMongoStage(this.amcMongoReq, (resp: AmcMongoStagesResp) => {
      this.amcMongoReq.mongoId = resp.id;
    })
  }

  setFundDetails() {
    this.amcMongoReq.cp_amc_withdrawal.partialRequestDetails.fundDetails = [];

    this.withdrawReq.postedAmount.forEach(data => {
      let fund = new FundDetails();
      fund.amount = data.amount;
      fund.fundCode = data.fundCode;
      fund.fundName = data.fundName;
      this.amcMongoReq.cp_amc_withdrawal.partialRequestDetails.fundDetails.push(fund);
    });
  }

}
