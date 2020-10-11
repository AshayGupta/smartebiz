import { LoanConstants, StatusCode, LocalStorageKey, ClientDetailsStorageKey } from './../../../../common/enums/enums';
import { LogonService } from './../../../../providers/services/auth/logon.service';
import { BankAccountsReq, BankAccountsResp, BankAccountsList } from './../../../../dataModels/get-bank-accounts.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BankAccountsService } from '../../../../providers/services/main-module-services/bank-module-services/get-bank-accounts.service';
import { RemoveQuoteReq, RemoveQuoteResp } from '../../../../dataModels/remove-quote.model';
import { RemoveQuoteService } from '../../../../providers/services/main-module-services/loan-module-services/remove-quote.service';
import { GenerateLoanQuoteService } from '../../../../providers/services/main-module-services/loan-module-services/generate-loan-quote.service';
import { GenerateLoanQuoteReq, GenerateLoanQuoteResp, Deduction } from '../../../../dataModels/generate-loan-quote.model';
import { VerifyLoanPage } from '../verify-loan/verify-loan';
import { AdvanceQuoteReq } from '../../../../dataModels/advance-quote.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CustomFirebaseAnalyticsProvider } from '../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { DateFormat } from '../../../../common/dateFormat/dateFormat';
import { PageTrack } from '../../../../common/decorators/page-track';

export enum BankPayoutValue {
  BANK = 'D',
  MPESA = 'M'
}

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-loan-payout',
  templateUrl: 'loan-payout.html',
}) 
export class LoanPayoutPage {

  loanPayoutForm: FormGroup;
  submitAttempt: boolean = false;
  headerTitle: string = 'Apply Loan';
  loanHistoryIcon: string = 'assets/imgs/Inbox.png';
  bankAccountsList: BankAccountsList[] = [];
  advanceQuoteReq: AdvanceQuoteReq = new AdvanceQuoteReq();
  quickQuote: boolean;
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
    public bankAccountsService: BankAccountsService,
    public removeQuoteService: RemoveQuoteService,
    public generateLoanQuoteService: GenerateLoanQuoteService,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider,
    public dateFormat: DateFormat
  ) {
    this.advanceQuoteReq = this.navParams.get('advanceQuoteData');
    this.quickQuote = this.navParams.get('quickQuote');
    this.validateForm();
  }

  validateForm() {
    if (this.advanceQuoteReq.paymentMode != this.bankPayoutList[1].name) {
      this.loanPayoutForm = this.formBuilder.group({
        bankNumber: ['', Validators.compose([Validators.required])],
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoanPayoutPage');

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('LoanPayoutPage'); 
        
    // If loanAmount is >= 70,000, do not give MPESA option.
    if (parseFloat(this.advanceQuoteReq.loanAmount) >= 70000) {
      this.advanceQuoteReq.mobile = '';
      this.bankPayoutList.splice(1, 1);
    }
    else {
      this.advanceQuoteReq.mobile = localStorage.getItem(ClientDetailsStorageKey.PhoneNumber);
    }
    this.advanceQuoteReq.paymentMode = this.bankPayoutList[0].value;
    this.getBankAccounts();
  }

  getBankAccounts() {
    let req = new BankAccountsReq();
    req.personNumber = this.advanceQuoteReq.perNo;
    req.lobSrc = this.advanceQuoteReq.lobSrc;

    this.bankAccountsService.getBankAccounts(req, (resp: BankAccountsResp) => {
      this.bankAccountsList = resp.bankAccountsList;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getBankAccounts();
          }
        })
      });
  }

  removeQuote() {
    let req = new RemoveQuoteReq();
    req.perNo = this.advanceQuoteReq.perNo;
    req.policyNo = this.advanceQuoteReq.policyNo;
    req.source = this.advanceQuoteReq.source;
    req.lobSrc = this.advanceQuoteReq.lobSrc;
    req.amount = '';

    this.removeQuoteService.removeQuote(req, (resp: RemoveQuoteResp) => {
      if (resp.status.toLowerCase() == 'success') {
        this.generateLoanQuote();
      }
    },
      (err: number) => {
        if (err == StatusCode.Status403) {
          this.logonService.getToken((isTokenValid: boolean) => {
            if (isTokenValid) {
              this.removeQuote();
            }
          })
        }
        else if (err == StatusCode.Status412) {
          this.generateLoanQuote();
        }
      });
  }

  generateLoanQuote() {
    let req = new GenerateLoanQuoteReq();
    req.perNo = this.advanceQuoteReq.perNo;
    req.policyNo = this.advanceQuoteReq.policyNo;
    req.loanAmount = this.advanceQuoteReq.loanAmount;
    req.source = this.advanceQuoteReq.source;
    req.lobSrc = this.advanceQuoteReq.lobSrc;
    req.loanPeriodMonths = this.advanceQuoteReq.loanPeriod;
    // req.deductionObject.deduction.type = LoanConstants.STAMP_DUTY;  // LFEE_DMND PORTAL_CHARGE

    let loanConstantsArray = [];
    loanConstantsArray.push(LoanConstants.STAMP_DUTY);
    loanConstantsArray.push(LoanConstants.PORTAL_CHARGE);
    loanConstantsArray.push(LoanConstants.LFEE_DMND);

    loanConstantsArray.forEach(item => {
      let dec = new Deduction();
      dec.type = item;
      req.deductionArray.push(dec)
    })

    req.startDate = this.dateFormat.formatyyyyMMddHHmmss(new Date())
    req.valuationDate = this.dateFormat.formatyyyyMMddHHmmss(new Date())

    this.generateLoanQuoteService.getGenerateLoanQuote(req, (resp: GenerateLoanQuoteResp) => {
      this.advanceQuoteReq.monthlyInstallment = resp.monthlyPay;
      this.advanceQuoteReq.interestPaid = resp.totalInterest;
      this.advanceQuoteReq.totalAmount = resp.totalCost;
      this.advanceQuoteReq.deductionList = resp.deductionList;

      this.navCtrl.push(VerifyLoanPage, { 'advanceQuoteData': this.advanceQuoteReq });
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.generateLoanQuote();
          }
        })
      });
  }

  proceedClicked() {
    //this.navCtrl.push(VerifyLoanPage, { 'advanceQuoteData': this.advanceQuoteReq });
    //return;

    console.log(this.advanceQuoteReq);

    if (this.quickQuote) {
      this.removeQuote();
    }
    else {
      this.generateLoanQuote()
    }

  }

  selectBank(accountNumberId: string) {
    this.bankAccountsList.filter((data: BankAccountsList) => {
      if (accountNumberId == data.accountNumberId) {
        this.advanceQuoteReq.bankAccNo = data.accountNumber;
        this.advanceQuoteReq.bankBranch = data.bankBranch;
        this.advanceQuoteReq.accountName = data.accountName;
        this.advanceQuoteReq.bankName = data.bankName;
 
      }
    })

  }

  payoutSelect(paymentMode: string) {
    if (paymentMode == BankPayoutValue.BANK) {
      this.loanPayoutForm = this.formBuilder.group({
        bankNumber: ['', Validators.compose([Validators.required])],
      });
    }
    else {
      this.loanPayoutForm.controls.bankNumber.clearValidators();
      this.loanPayoutForm.controls.bankNumber.updateValueAndValidity();
      this.advanceQuoteReq.bankBranch = ''
      this.advanceQuoteReq.bankAccNo = ''
      this.advanceQuoteReq.bankNumber = ''
      this.advanceQuoteReq.bankName = ''
    }
  }

}
