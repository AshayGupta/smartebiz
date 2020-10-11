import { HttpErrorResponse } from '@angular/common/http';
import { VerifyFundsPage } from './../verify-funds/verify-funds';
import { RegexPattern } from './../../../../../common/constants/constants';
import { BuyProductReq, Investment } from './../../../../../dataModels/buy-product-model';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LogonService } from './../../../../../providers/services/auth/logon.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ActionItemsReq, ActionItemsResp, FundsList } from '../../../../../dataModels/product-action-items.model';
import { GetProductService } from '../../../../../providers/services/main-module-services/buy-product-module-services/get-product.service';
import { AmcMongoStagesReq, Stages } from '../../../../../dataModels/amc-mongo-stages.model';
import { AmcMongoStagesService } from '../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';
import { MongoAMCStaging } from '../../../../../common/enums/enums';

@IonicPage()
@Component({
  selector: 'page-investment-amount',
  templateUrl: 'investment-amount.html'
})

export class InvestmentAmountPage {

  investmentForm: FormGroup;
  submitAttempt: boolean = false;
  headerTitle: string = 'Investment Details';
  buyProductReq: BuyProductReq;
  investment: Investment = new Investment();
  fundList: FundsList[];
  onboardingMongoReq = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public logonService: LogonService,
    public getProductService: GetProductService,
    private amcMongoStagesService: AmcMongoStagesService
  ) {
    this.buyProductReq = this.navParams.get("buyProductReq");
    this.investment = this.buyProductReq.investment;
    this.onboardingMongoReq = this.navParams.get('amcMongoReq');
    console.log('InvestmentAmountPage buyProductReq ->', this.buyProductReq);

    this.validateForm();
  }

  validateForm() {
    this.investmentForm = this.formBuilder.group({
      investAmount: ['', Validators.compose([Validators.required, Validators.pattern(RegexPattern.onlyContainNumbers), Validators.min(parseInt(this.investment.selectedFund.minInvestmentAmnt))])],
      otherFunds: this.formBuilder.array([])
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InvestmentAmountPage');
    /* remove existing data form the investment model */
    this.investment.moreFunds = [];
    this.investment.totalAmount = "0.00";
    this.getFunds();
  }

  getFunds() {
    let reqData = new ActionItemsReq();
    // reqData.productCode = "";
    reqData.lobSrc = this.buyProductReq.lobSrc;

    this.getProductService.getProduct(reqData, (resp: ActionItemsResp) => {
      this.fundList = resp.fundsList.filter(fund => {
        return fund.productCode != this.investment.selectedFund.productCode
      }).sort(function (a, b) { return parseInt(a.productOrdering) > parseInt(b.productOrdering) ? 1 : -1; });
      this.addOtherFundsForm();
    },
      (err: HttpErrorResponse) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getFunds();
          }
        })
      });
  }

  addOtherFundsForm() {
    for (var i = 0; i < this.fundList.length; i++) {
      const otherFundsForm = this.formBuilder.group({
        investAmount: ['', Validators.compose([Validators.pattern(RegexPattern.onlyContainNumbers), Validators.min(parseInt(this.fundList[i].minInvestmentAmnt))])]
      });
      (<FormArray>this.investmentForm.controls.otherFunds).push(otherFundsForm);
    }
  }

  calculateAmount(fund?: FundsList, index?: number) {
    let totalAmt: number = 0;

    if (this.investmentForm.controls.investAmount.value) {
      totalAmt += parseFloat(this.investmentForm.controls.investAmount.value);
    }

    for (let i = 0; i < this.investmentForm.controls.otherFunds.value.length; i++) {
      let otherFundAmt = (<FormGroup>(<FormArray>this.investmentForm.controls.otherFunds).controls[i]).controls.investAmount.value;
      console.log(otherFundAmt);

      if (otherFundAmt) {
        totalAmt += parseFloat(otherFundAmt);
      }
    }

    this.investment.totalAmount = totalAmt.toString();
    console.log('totalAmt =>', totalAmt);
  }

  proceedClicked() {
    this.investment.selectedFund.investedAmount = this.investmentForm.controls.investAmount.value;

    this.investment.moreFunds = [];
    for (let i = 0; i < this.investmentForm.controls.otherFunds.value.length; i++) {
      let otherFundAmt = (<FormGroup>(<FormArray>this.investmentForm.controls.otherFunds).controls[i]).controls.investAmount.value;
      if (otherFundAmt && parseFloat(otherFundAmt) >= parseFloat(this.fundList[i].minInvestmentAmnt)) {
        let fund = this.fundList[i]
        fund.investedAmount = otherFundAmt;
        this.investment.moreFunds.push(fund);
      }
    }

    this.setStagesInMongo(MongoAMCStaging.Done);

    this.buyProductReq.investment = this.investment;
    console.log('buyProductReq ->', this.buyProductReq);
    this.navCtrl.push(VerifyFundsPage, { "buyProductReq": this.buyProductReq, 'amcMongoReq': this.onboardingMongoReq });
  }

  setStagesInMongo(status: string) {
    this.onboardingMongoReq["stages"].filter(item => {
      if (item.name == "investmentFund") {
        item.status = status;
      }
    });

    let fundList = [];
    let fundObj = {
      fundCode: '',
      fundName: '',
      fundValue: ''
    }
    this.investment.moreFunds.filter(item => {
      fundObj.fundCode = item.productCode;
      fundObj.fundName = item.productName;
      fundObj.fundValue = item.investedAmount;
      fundList.push(fundObj);
    });
    fundObj.fundCode = this.investment.selectedFund.productCode;
    fundObj.fundName = this.investment.selectedFund.productName;
    fundObj.fundValue = this.investment.selectedFund.investedAmount;
    fundList.push(fundObj);

    this.onboardingMongoReq["investmentFund"] = fundList;
    // this.onboardingMongoReq["investmentAmount"] = this.investment.totalAmount;


    this.amcMongoStagesService.updateAmcMongoStage(this.onboardingMongoReq, (resp) => {
    })

  }
}
