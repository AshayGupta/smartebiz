import { ProcessPartialWithdrawalReq } from './../../../../dataModels/process-partial-withdraw.model';
import { LogonService } from './../../../../providers/services/auth/logon.service';
import { BankAccountsReq, BankAccountsResp, BankAccountsList } from './../../../../dataModels/get-bank-accounts.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BankAccountsService } from '../../../../providers/services/main-module-services/bank-module-services/get-bank-accounts.service';
import { AccountList } from '../../../../dataModels/account-list.model';
 import { PartialWithdrawVerifyPage } from '../partial-withdraw-verify/partial-withdraw-verify';
import { BankPayoutValue } from '../../loan-module/loan-payout/loan-payout';
import { PartialWithdrawHistoryPage } from '../partial-withdraw-history/partial-withdraw-history';
import { CustomFirebaseAnalyticsProvider } from '../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../../common/decorators/page-track';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-partial-withdraw-payout',
  templateUrl: 'partial-withdraw-payout.html',
})
export class PartialWithdrawPayoutPage {

  headerTitle: string = 'Withdrawal Request';
  partialHistoryIcon: string = 'assets/imgs/Inbox.png';
  policyData: AccountList;
  bankAccountsList: BankAccountsList[] = [];
  processPartialWithdrawalReq: ProcessPartialWithdrawalReq = new ProcessPartialWithdrawalReq();
  bankPayoutList = [
    { name: 'BANK', value: BankPayoutValue.BANK },
    // { name: 'MPESA', value: BankPayoutValue.MPESA },
  ]

  get bankPayoutTag() { return BankPayoutValue; }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public logonService: LogonService,
    public bankAccountsService: BankAccountsService,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider
  ) {
    this.policyData = this.navParams.get('policyData');
    this.processPartialWithdrawalReq = this.navParams.get('processPartialWithdrawalData');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoanPayoutPage');
    this.processPartialWithdrawalReq.paymentMode = this.bankPayoutList[0].value;
    this.getBankAccounts(); 

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('Payout Partial Withdraw'); 
    
  }

  getBankAccounts() {
    let req = new BankAccountsReq();
    req.personNumber = this.processPartialWithdrawalReq.perno;
    req.lobSrc = this.processPartialWithdrawalReq.lobSrc;

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

  proceedClicked() {
    console.log(this.processPartialWithdrawalReq);


    this.processPartialWithdrawalReq.totalDeductionAmt = parseFloat(this.processPartialWithdrawalReq.surrenderFee + this.processPartialWithdrawalReq.totalSellCharge + this.processPartialWithdrawalReq.exciseDuty + this.processPartialWithdrawalReq.surrAdminChg).toString();

    if (this.processPartialWithdrawalReq.totalDeductionAmt == 'NaN' || parseFloat(this.processPartialWithdrawalReq.totalDeductionAmt) <= 0) {
      this.processPartialWithdrawalReq.totalDeductionAmt = '0.0';
    }

    this.navCtrl.push(PartialWithdrawVerifyPage, { 'processPartialWithdrawalReq': this.processPartialWithdrawalReq });
  }

  selectBank(bankNumber: string) {
    this.bankAccountsList.filter((data: BankAccountsList) => {
      if (bankNumber == data.bankNumber) {
        this.processPartialWithdrawalReq.bankAccNo = data.accountNumber;
        this.processPartialWithdrawalReq.bankBranch = data.bankBranch;
        this.processPartialWithdrawalReq.accountName = data.accountName;
        this.processPartialWithdrawalReq.bankName = data.bankName;

      }
    })
  }

  payoutSelect(paymentMode: string) {
    if (paymentMode == BankPayoutValue.BANK) {
    }
    else {
      this.processPartialWithdrawalReq.bankBranch = ''
      this.processPartialWithdrawalReq.bankAccNo = ''
      this.processPartialWithdrawalReq.bankNumber = ''
    }
  }

  goToWithdrawHistory() {
    this.navCtrl.push(PartialWithdrawHistoryPage);
  }

}
