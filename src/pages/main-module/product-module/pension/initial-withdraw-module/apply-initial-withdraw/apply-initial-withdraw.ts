import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountList } from '../../../../../../dataModels/account-list.model';
import { ProcessPartialWithdrawalReq } from '../../../../../../dataModels/process-partial-withdraw.model';
import { AmcMongoStagesReq, Stages } from '../../../../../../dataModels/amc-mongo-stages.model';
import { MongoAMCStaging, SourceTag, Lob, LocalStorageKey, ClientDetailsStorageKey, PageName, MongoSourceTag, ChannelTag } from '../../../../../../common/enums/enums';
import { LogonService } from '../../../../../../providers/services/auth/logon.service';
import { GetPensionPartialAmountService } from '../../../../../../providers/services/main-module-services/product-services/pension-services/getPensionPartialAmount.service';
import { AmcMongoStagesService } from '../../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';
import { CustomFirebaseAnalyticsProvider } from '../../../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PartialAmountValidator } from '../../../../../../common/validators/partialAmount.validation';
import { GetPensionPartialAmountReq, GetPensionPartialAmountResp } from '../../../../../../dataModels/getPensionPartialAmount.model';
import { AddNewBankPage } from '../add-new-bank/add-new-bank';
import { UserDetails } from '../../../../../../dataModels/user-details.model';
import { ApiUrl, Environment } from '../../../../../../common/constants/constants';
import { Utils } from '../../../../../../common/utils/utils';


export class EmpViewDetail {
  balance: string = "0.00";
  lockedInAmount: string = "0.00";
  availablebalance: string = "0.00";
}

@IonicPage()
@Component({
  selector: 'page-apply-initial-withdraw',
  templateUrl: 'apply-initial-withdraw.html',
})
export class ApplyInitialwithdrawPage {

  applyPartialForm: FormGroup;
  submitAttempt: boolean = false;
  headerTitle: string = 'Withdrawal Request';
  partialHistoryIcon: string = 'assets/imgs/Inbox.png';
  policyData: AccountList;
  processPartialWithdrawalReq: ProcessPartialWithdrawalReq;
  pensionMongpReq: AmcMongoStagesReq = new AmcMongoStagesReq();
  stages: Stages[] = [
    {
      name: "Selection of Amount",
      status: MongoAMCStaging.Done
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
    }
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public logonService: LogonService,
    public getPartialAmountService: GetPensionPartialAmountService,
    public pensionMongoStagingService: AmcMongoStagesService,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider,
    private iab: InAppBrowser,
  ) {
    this.policyData = this.navParams.get('policyData');
    console.log("this.policyData==>", this.policyData)
    this.processPartialWithdrawalReq = new ProcessPartialWithdrawalReq();

    this.validateForm();
  }

  validateForm() {
    this.applyPartialForm = this.formBuilder.group({
      withdrawalAmount: ["", [Validators.required, PartialAmountValidator.isValid]]
    });
  }
  
  maxAmountValidator() {
    this.applyPartialForm.clearValidators();
    this.applyPartialForm.controls['withdrawalAmount'].setValidators([
      Validators.max(parseFloat(this.processPartialWithdrawalReq.netValue)),
      Validators.required,
      PartialAmountValidator.isValid
    ]);
    this.applyPartialForm.get('withdrawalAmount').updateValueAndValidity();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApplyInitialwithdrawPage');
    this.setupPage();

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('IW ApplyLoan');
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter ApplyInitialwithdrawPage")
    let isDelete = localStorage.getItem(LocalStorageKey.Delete)
    if (isDelete == 'true') {
      localStorage.removeItem(LocalStorageKey.Delete);
      this.processPartialWithdrawalReq = new ProcessPartialWithdrawalReq();
      this.setupPage();
    }
  }

  setupPage() {
    this.processPartialWithdrawalReq.policyName = this.policyData.productName
    this.processPartialWithdrawalReq.policyNo = this.policyData.accountNumber;
    this.processPartialWithdrawalReq.userDetails.idType = localStorage.getItem(LocalStorageKey.NationalIDType);
    this.processPartialWithdrawalReq.userDetails.idValue = localStorage.getItem(LocalStorageKey.NationalID);
    this.processPartialWithdrawalReq.source = SourceTag.MOBILE;
    this.processPartialWithdrawalReq.lobSrc = Lob.PENSION;
    this.processPartialWithdrawalReq.perno = localStorage.getItem(ClientDetailsStorageKey.PersonNo);
    // this.processPartialWithdrawalReq.mobile = localStorage.getItem(ClientDetailsStorageKey.PhoneNumber);
    this.processPartialWithdrawalReq.withdrawalAmount = "0";
    this.getPartialAmount();
  }

  getPartialAmount() {
    let req = new GetPensionPartialAmountReq();
    req.lobSrc = Lob.PENSION;
    req.memberId = this.processPartialWithdrawalReq.policyNo;

    this.getPartialAmountService.getPartialAmount(req, (resp: GetPensionPartialAmountResp) => {
      this.calculateEmpDetail(resp);
    },
      (err: HttpErrorResponse) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getPartialAmount();
          }
        })
      });

  }

  calculateEmpDetail(empDetail: GetPensionPartialAmountResp) {
    let netVal = 0;

    if (empDetail.registeredDetail) {
      // For Registered Employee
      this.processPartialWithdrawalReq.totalBalance0 = empDetail.registeredDetail.ee_closing_bal_value;
      this.processPartialWithdrawalReq.lockedInAmount0 = empDetail.registeredDetail.locked_in_amount;
      this.processPartialWithdrawalReq.availableBalance0 = (parseFloat(this.processPartialWithdrawalReq.totalBalance0) - parseFloat(this.processPartialWithdrawalReq.lockedInAmount0)).toString();

      // For Registered Employer
      this.processPartialWithdrawalReq.regEmployerBalance = empDetail.registeredDetail.er_closing_bal_value;
      this.processPartialWithdrawalReq.regEmployerLockedInAmt = empDetail.registeredDetail.locked_in_amount;
      this.processPartialWithdrawalReq.regEmployerAvailableBal = (parseFloat(this.processPartialWithdrawalReq.regEmployerBalance) - parseFloat(this.processPartialWithdrawalReq.regEmployerLockedInAmt)).toString();

      netVal += parseFloat(this.processPartialWithdrawalReq.availableBalance0) + parseFloat(this.processPartialWithdrawalReq.regEmployerAvailableBal);
    }

    if (empDetail.unRegisteredDetail) {
      // For unRegistered Employee
      this.processPartialWithdrawalReq.totalBalance1 = empDetail.unRegisteredDetail.ee_closing_bal_value;
      this.processPartialWithdrawalReq.lockedInAmount1 = empDetail.unRegisteredDetail.locked_in_amount;
      this.processPartialWithdrawalReq.availableBalance1 = (parseFloat(this.processPartialWithdrawalReq.totalBalance1) - parseFloat(this.processPartialWithdrawalReq.lockedInAmount1)).toString();

      // For unRegistered Employer
      this.processPartialWithdrawalReq.unRegEmployerBalance = empDetail.unRegisteredDetail.er_closing_bal_value;
      this.processPartialWithdrawalReq.unRegEmployerLockedInAmt = empDetail.unRegisteredDetail.locked_in_amount;
      this.processPartialWithdrawalReq.unRegEmployerAvailableBal = (parseFloat(this.processPartialWithdrawalReq.unRegEmployerBalance) - parseFloat(this.processPartialWithdrawalReq.unRegEmployerLockedInAmt)).toString();

      netVal += parseFloat(this.processPartialWithdrawalReq.availableBalance1) + parseFloat(this.processPartialWithdrawalReq.unRegEmployerAvailableBal);
    }

    this.processPartialWithdrawalReq.netValue = netVal.toString();

    this.maxAmountValidator();
  }

  proceedClicked() {
    this.setMongoStages();

    console.log(this.processPartialWithdrawalReq);
    this.navCtrl.push(AddNewBankPage, {
      'policyData': this.policyData,
      'processPartialWithdrawalReq': this.processPartialWithdrawalReq,
      "pensionMongoReq": this.pensionMongpReq
    });
  }

  rangeSlider(event) {
    // console.log(event.value);
  }

  goToWithdrawHistory() {
    // this.navCtrl.push(PartialWithdrawHistoryPage);
  }

  taxCalculatorClicked() {
    let downloadUrl: string = ApiUrl.profileImgUrl + "/documents/121987/1448234/TAX+CALCULATOR+ENHANCED.xlsx/b6d646b0-0d13-f4df-45a8-a3047dc92dbb?t=1597308801717&download=true";

    console.log('taxCalculatorClicked url ->', downloadUrl);

    let opts: string = "location=yes,clearcache=yes,hidespinner=no"
    this.iab.create(downloadUrl, '_system', opts);
  }


  setMongoStages() {
    this.pensionMongpReq = new AmcMongoStagesReq();
    this.pensionMongpReq.cp_pension_partial = {};

    let policyDetails = {
      lobSrc: Lob.PENSION,
      accountNumber: this.policyData.accountNumber
    }

    let userDetails = new UserDetails();
    userDetails.idType = localStorage.getItem(LocalStorageKey.NationalIDType);
    userDetails.idValue = localStorage.getItem(LocalStorageKey.NationalID);

    let partialRequestDetails = {
      maximumAmount: this.processPartialWithdrawalReq.netValue,
      withDrawalAmount: this.processPartialWithdrawalReq.withdrawalAmount
    }

    this.pensionMongpReq.collection = "cp_pension_partial";
    this.pensionMongpReq.cp_pension_partial["source"] = MongoSourceTag.MOBILEAPP
    this.pensionMongpReq.cp_pension_partial["channel"] = ChannelTag.MOBILE;
    this.pensionMongpReq.cp_pension_partial["TargetLob"] = "Pension",
    this.pensionMongpReq.cp_pension_partial["transactionId"] = 'TR_' + Utils.autoIncID();
    this.pensionMongpReq.cp_pension_partial['stages'] = this.stages;
    this.pensionMongpReq.cp_pension_partial['policyDetails'] = policyDetails;
    this.pensionMongpReq.cp_pension_partial['userDetails'] = userDetails;
    this.pensionMongpReq.cp_pension_partial['partialRequestDetails'] = partialRequestDetails;

    this.pensionMongoStagingService.createAmcMongoStage(this.pensionMongpReq, (resp) => {
      this.pensionMongpReq.mongoId = resp.id;
    })
  }

}
