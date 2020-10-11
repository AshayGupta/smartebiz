import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InitialWithdrawVerifyPage } from '../initial-withdraw-verify/initial-withdraw-verify';
import { AccountList } from '../../../../../../dataModels/account-list.model';
import { BankDetailList, BankDetailsReq, BankDetailsResp } from '../../../../../../dataModels/get-bank-details.model';
import { ProcessPartialWithdrawalReq } from '../../../../../../dataModels/process-partial-withdraw.model';
import { AmcMongoStagesReq } from '../../../../../../dataModels/amc-mongo-stages.model';
import { BankPayoutValue } from '../../../../loan-module/loan-payout/loan-payout';
import { LogonService } from '../../../../../../providers/services/auth/logon.service';
import { BankDetailsService } from '../../../../../../providers/services/main-module-services/bank-module-services/get-bank-details.service';
import { AmcMongoStagesService } from '../../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';
import { CustomFirebaseAnalyticsProvider } from '../../../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PasswordValidator } from '../../../../../../common/validators/password.validator';
import { RegexPattern } from '../../../../../../common/constants/constants';
import { MongoAMCStaging } from '../../../../../../common/enums/enums';


@IonicPage()
@Component({
  selector: 'page-add-new-bank',
  templateUrl: 'add-new-bank.html',
})
export class AddNewBankPage {

  addNewForm: FormGroup;
  submitAttempt: boolean = false;
  headerTitle: string = 'Add New Bank';
  partialHistoryIcon: string = 'assets/imgs/Inbox.png';
  policyData: AccountList;
  bankDetailsList: BankDetailList[] = [];
  bankBranchList: BankDetailList[] = [];
  processInitialWithdrawalReq: ProcessPartialWithdrawalReq;
  pensionMongoReq: AmcMongoStagesReq = new AmcMongoStagesReq();

  bankPayoutList = [
    { name: 'BANK', value: BankPayoutValue.BANK },
    { name: 'MPESA', value: BankPayoutValue.MPESA },
  ]

  get bankPayoutTag() { return BankPayoutValue; }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public logonService: LogonService,
    public bankAccountsService: BankDetailsService,
    public pensionMongoStagingService: AmcMongoStagesService,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider
  ) {
    this.policyData = this.navParams.get('policyData');
    this.processInitialWithdrawalReq = this.navParams.get('processPartialWithdrawalReq');
    this.pensionMongoReq = this.navParams.get('pensionMongoReq');
    console.log("processInitialWithdrawalReq==>", this.processInitialWithdrawalReq)
    this.processInitialWithdrawalReq.paymentMode = this.bankPayoutList[0].value;

    this.validateForm();
  }

  validateForm() {
    if (this.processInitialWithdrawalReq.paymentMode == this.bankPayoutList[0].value) {
      this.addNewForm = this.formBuilder.group({
        bankName: ['', Validators.compose([Validators.required])],
        bankBranch: ['', Validators.compose([Validators.required])],
        accountNumber: ['', Validators.compose([Validators.required])],
        verifyAccountNo: ['', Validators.compose([Validators.required, PasswordValidator.Match("accountNumber", "verifyAccountNo")])],
        accountHolderName: ['', Validators.compose([Validators.required])],
      });
    }
    else {
      this.addNewForm = this.formBuilder.group({
        mobileNumber: ['', Validators.compose([Validators.required, Validators.pattern(RegexPattern.numStartWithZero), Validators.pattern(RegexPattern.onlyContainNumbers), Validators.minLength(10), Validators.maxLength(10)])],
        verifyMobileNo:['',Validators.compose([Validators.required, Validators.pattern(RegexPattern.onlyContainNumbers), Validators.minLength(10), Validators.maxLength(10), PasswordValidator.Match('mobileNumber','verifyMobileNo')])]
      });
    }
  }

  addValidations() {
    this.addNewForm.get('verifyAccountNo').clearValidators();
    
    this.addNewForm.controls['verifyAccountNo'].setValidators([
      Validators.required, 
      PasswordValidator.Match("accountNumber", "verifyAccountNo")
    ]);
    this.addNewForm.get('verifyAccountNo').updateValueAndValidity();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddNewBankPage');

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('IW AddNewBank');

    // If loanAmount is >= 70,000, do not give MPESA option.
    if (parseFloat(this.processInitialWithdrawalReq.withdrawalAmount) >= 70000) {
      // this.processInitialWithdrawalReq.mobile = '';
      this.bankPayoutList.splice(1, 1);
    }

    this.processInitialWithdrawalReq.paymentMode = this.bankPayoutList[0].value;
    this.setupPage();
  }

  setupPage() {
    this.processInitialWithdrawalReq.countryCode = "";
    this.processInitialWithdrawalReq.filterValue = "ND";
    // this.processInitialWithdrawalReq.source = "BANKS";
    this.processInitialWithdrawalReq.siteAgentno = "9290";
    this.processInitialWithdrawalReq.systemCode = "003";
    this.processInitialWithdrawalReq.transactionId = "45788";
    this.getBankDetails();
  }

  getBankDetails() {
    let req = new BankDetailsReq();
    req.lobSrc = this.processInitialWithdrawalReq.lobSrc;
    req.countryCode = this.processInitialWithdrawalReq.countryCode;
    req.filterValue = this.processInitialWithdrawalReq.filterValue;
    req.listType = "BANKS";
    req.policyStatus = this.processInitialWithdrawalReq.policyNo;
    req.siteAgentNumber = this.processInitialWithdrawalReq.siteAgentno;
    req.systemCode = this.processInitialWithdrawalReq.systemCode;
    req.transactionNumber = this.processInitialWithdrawalReq.transactionId;

    this.bankAccountsService.getBankDetails(req, (resp: BankDetailsResp) => {
      this.bankDetailsList = resp.bankDetailList;
      this.selectBank(this.processInitialWithdrawalReq.bankNumber);
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getBankDetails();
          }
        })
      });
  }


  payoutSelect(paymentMode: string) {
    this.validateForm();

    if (paymentMode == BankPayoutValue.BANK) {
    }
    else {
      // this.processInitialWithdrawalReq.bankBranch = ''
      // this.processInitialWithdrawalReq.bankAccNo = ''
      // this.processInitialWithdrawalReq.bankNumber = ''
    }
  }

  selectBank(bankCode: string) {
    this.bankDetailsList.filter((data: BankDetailList) => {
      if (bankCode == data.code) {
        this.processInitialWithdrawalReq.bankName = data.description;
        this.processInitialWithdrawalReq.bankNumber = data.code;
        this.processInitialWithdrawalReq.process = data.extraAttribute;
      }
    });
    this.getBranch(bankCode);
  }

  getBranch(bankCode) {
    let req = new BankDetailsReq();
    req.lobSrc = this.processInitialWithdrawalReq.lobSrc;
    req.countryCode = this.processInitialWithdrawalReq.countryCode;
    req.filterValue = bankCode;
    req.listType = "BANK_BRANCHES";
    req.policyStatus = this.processInitialWithdrawalReq.policyNo;
    req.siteAgentNumber = this.processInitialWithdrawalReq.siteAgentno;
    req.systemCode = this.processInitialWithdrawalReq.systemCode;
    req.transactionNumber = this.processInitialWithdrawalReq.transactionId;

    this.bankAccountsService.getBankDetails(req, (resp: BankDetailsResp) => {
      this.bankBranchList = resp.bankDetailList;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getBranch(bankCode);
          }
        })
      });
  }

  selectBranch(branchCode) {
    this.bankBranchList.filter((data: BankDetailList) => {
      if (branchCode == data.code) {
        this.processInitialWithdrawalReq.bankBranch = data.description;
        this.processInitialWithdrawalReq.branchCode = data.code;
        this.processInitialWithdrawalReq.surrAdminChg = data.extraAttribute;
      }
    });
  }

  proceedClicked() {
    this.updateMongoStage();
    this.navCtrl.push(InitialWithdrawVerifyPage, {
      'processPartialWithdrawalReq': this.processInitialWithdrawalReq, "pensionMongoReq": this.pensionMongoReq
    });
  }

  updateMongoStage() {
    this.pensionMongoReq.cp_pension_partial["stages"].filter(item => {
      if (item.name == "Bank Details Add") {
        item.status = MongoAMCStaging.Done;
      }
    });
    let payoutDetails = {};
    if (this.processInitialWithdrawalReq.paymentMode == "D") {
      payoutDetails['bankId'] = this.processInitialWithdrawalReq.bankNumber;
      payoutDetails['branchName'] = this.processInitialWithdrawalReq.bankBranch;
      payoutDetails['bankAccountNo'] = this.processInitialWithdrawalReq.bankAccNo;
      payoutDetails['bankName'] = this.processInitialWithdrawalReq.bankName;
      payoutDetails['accountHolderName'] = this.processInitialWithdrawalReq.accountName;
      payoutDetails['payoutMethod'] = "BANK";
    } else {
      payoutDetails['mobileNumber'] = this.processInitialWithdrawalReq.mobile;
      payoutDetails['payoutMethod'] = "MPESA";
    }

    this.pensionMongoReq.cp_pension_partial['payoutDetails'] = payoutDetails;

    this.pensionMongoStagingService.updateAmcMongoStage(this.pensionMongoReq, (resp) => {
    });
  }

}
