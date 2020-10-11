import { AccountList } from './../../../../dataModels/account-list.model';
import { LoanQuoteReq, LoanQuoteResp } from './../../../../dataModels/loan-quote.model';
import { LogonService } from './../../../../providers/services/auth/logon.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Range } from 'ionic-angular';
import { LoanQuoteService } from '../../../../providers/services/main-module-services/loan-module-services/loan-quote.service';
import { LoanPayoutPage } from '../loan-payout/loan-payout';
import { SourceTag, Lob, LocalStorageKey, ClientDetailsStorageKey } from '../../../../common/enums/enums';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdvanceQuoteReq } from './../../../../dataModels/advance-quote.model';
import { LoanHistoryPage } from './../loan-history/loan-history';
import { LoanBalancesReq, LoanBalancesResp } from '../../../../dataModels/loan-balance.model';
import { LoanBalancesService } from './../../../../providers/services/main-module-services/loan-module-services/get-loan-balance.service';
import { Utils } from './../../../../common/utils/utils';
import { LoanAmountValidator } from '../../../../common/validators/loanAmount.validation';
import { CustomFirebaseAnalyticsProvider } from '../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { DateFormat } from '../../../../common/dateFormat/dateFormat';
import { PageTrack } from '../../../../common/decorators/page-track';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-apply-loan',
  templateUrl: 'apply-loan.html',
})
export class ApplyLoanPage {

  applyLoanForm: FormGroup;
  submitAttempt: boolean = false;
  headerTitle: string = 'Apply Loan';
  loanHistoryIcon: string = 'assets/imgs/Inbox.png';
  policyData: AccountList;
  advanceQuoteReq: AdvanceQuoteReq = new AdvanceQuoteReq();
  quickQuote: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public logonService: LogonService,
    public loanQuoteService: LoanQuoteService,
    public loanBalanceService: LoanBalancesService,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider,
    public dateFormat: DateFormat
  ) {
    this.validateForm();
    this.policyData = this.navParams.get('policyData');
  }

  validateForm() {
    this.applyLoanForm = this.formBuilder.group({
      loanAmount: ['', Validators.compose([Validators.required, LoanAmountValidator.isValid(this.advanceQuoteReq.availableAmount)])],
      loanPeriod: [''],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApplyLoanPage');
    this.setupPage();

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('ApplyLoanPage');
  }

  setupPage() {
    this.advanceQuoteReq.policyName = this.policyData.productName
    this.advanceQuoteReq.policyNo = this.policyData.accountNumber;
    this.advanceQuoteReq.userDetails.idType = localStorage.getItem(LocalStorageKey.NationalIDType);
    this.advanceQuoteReq.userDetails.idValue = localStorage.getItem(LocalStorageKey.NationalID)
    this.advanceQuoteReq.source = SourceTag.CP;
    this.advanceQuoteReq.lobSrc = Lob.LIFE;
    this.advanceQuoteReq.perNo = localStorage.getItem(ClientDetailsStorageKey.PersonNo);

    this.getLoanQuote();
  }

  getLoanQuote() {
    let req = new LoanQuoteReq();
    req.policyNo = this.advanceQuoteReq.policyNo;
    req.perNo = this.advanceQuoteReq.perNo;
    req.lobSrc = this.advanceQuoteReq.lobSrc;
    req.source = this.advanceQuoteReq.source;

    this.loanQuoteService.getLoanQuote(req, (resp: LoanQuoteResp) => {
      if (resp.code == '009341') {
        this.quickQuote = false;
        this.getLoanBalances();
      }
      else {
        this.quickQuote = true;
        this.advanceQuoteReq.availableAmount = resp.availableAmount;
        this.advanceQuoteReq.loanLimit = resp.loanLimit;
        this.advanceQuoteReq.loanAmount = resp.loanAmount;
        this.advanceQuoteReq.rateOfInterest = resp.rateOfInterest;
        this.advanceQuoteReq.loanPeriod = resp.loanPeriod;
      }
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getLoanQuote();
          }
        })
      });
  }

  getLoanBalances() {
    // console.log(this.dateFormat.formatyyyyMMddHHmmss(new Date()));
    let req = new LoanBalancesReq();
    req.policyNo = this.advanceQuoteReq.policyNo;
    req.perNo = this.advanceQuoteReq.perNo;
    req.lobSrc = this.advanceQuoteReq.lobSrc;
    req.source = this.advanceQuoteReq.source;
    req.toDate = this.dateFormat.formatYYYMMDDT(new Date()); //'2019-06-26T00:00:00';

    this.loanBalanceService.getLoanBalance(req, (resp: LoanBalancesResp) => {
      this.advanceQuoteReq.availableAmount = resp.availableAmount;
      this.advanceQuoteReq.loanAmount = '0.0';
      this.advanceQuoteReq.rateOfInterest = resp.rateOfInterest;
      this.advanceQuoteReq.loanPeriod = resp.loanPeriod;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getLoanBalances();
          }
        })
      });
  }

  proceedClicked() {
    console.log(this.advanceQuoteReq);
    this.advanceQuoteReq.loanAmount = Utils.ceilValue(this.advanceQuoteReq.loanAmount).toString();
    this.navCtrl.push(LoanPayoutPage, { 'advanceQuoteData': this.advanceQuoteReq, 'quickQuote': this.quickQuote });
  }

  goToLoanHistory() {
    this.navCtrl.push(LoanHistoryPage)
  }

  rangeSlider(event: Range) {
    // console.log(event.value);
    // event.max = parseFloat(this.advanceQuoteReq.availableAmount);
  }

  changeLoanAmt() {
    this.applyLoanForm.get('loanAmount').setValidators(
      LoanAmountValidator.isValid(this.advanceQuoteReq.availableAmount)
    );
  }

}
