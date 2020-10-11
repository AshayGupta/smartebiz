import { PartialWithdrawHistoryPage } from './../partial-withdraw-history/partial-withdraw-history';
import { AccountList } from '../../../../dataModels/account-list.model';
import { GeneratePartialAmountResp, GeneratePartialAmountReq } from '../../../../dataModels/partial-withdraw.model';
import { LogonService } from '../../../../providers/services/auth/logon.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GeneratePartialAmountService } from '../../../../providers/services/main-module-services/partial-withdraw-module-services/get-partial-amount.service';
import { LocalStorageKey, SourceTag, Lob, ClientDetailsStorageKey } from '../../../../common/enums/enums';
import { PartialWithdrawPayoutPage } from '../partial-withdraw-payout/partial-withdraw-payout';
import { ProcessPartialWithdrawalReq } from '../../../../dataModels/process-partial-withdraw.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PartialAmountValidator } from '../../../../common/validators/partialAmount.validation';
import { CustomFirebaseAnalyticsProvider } from '../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../../common/decorators/page-track';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-apply-partial-withdraw',
  templateUrl: 'apply-partial-withdraw.html',
})
export class ApplyPartialwithdrawPage {

  applyPartialForm: FormGroup;
  submitAttempt: boolean = false;
  headerTitle: string = 'Withdrawal Request';
  partialHistoryIcon: string = 'assets/imgs/Inbox.png';
  policyData: AccountList;
  processPartialWithdrawalReq: ProcessPartialWithdrawalReq = new ProcessPartialWithdrawalReq();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public logonService: LogonService,
    public getPartialWithdrawService: GeneratePartialAmountService,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider
  ) {
    this.policyData = this.navParams.get('policyData');
    this.validateForm(); 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApplyLoanPage');
    this.setupPage();

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('ApplyPartialWithdraw'); 

  } 

  validateForm() {
    this.applyPartialForm = this.formBuilder.group({
      withdrawalAmount: ['0.00', Validators.compose([Validators.required, PartialAmountValidator.isValid])]
    });
  }

  setupPage() {
    this.processPartialWithdrawalReq.policyName = this.policyData.productName
    this.processPartialWithdrawalReq.policyNo = this.policyData.accountNumber;
    this.processPartialWithdrawalReq.userDetails.idType = localStorage.getItem(LocalStorageKey.NationalIDType);
    this.processPartialWithdrawalReq.userDetails.idValue = localStorage.getItem(LocalStorageKey.NationalID);
    this.processPartialWithdrawalReq.source = SourceTag.CP;
    this.processPartialWithdrawalReq.lobSrc = Lob.LIFE;
    this.processPartialWithdrawalReq.perno = localStorage.getItem(ClientDetailsStorageKey.PersonNo);
    this.processPartialWithdrawalReq.mobile = localStorage.getItem(ClientDetailsStorageKey.PhoneNumber);

    this.getPartialAmount();
  }

  getPartialAmount() {
    let req = new GeneratePartialAmountReq();
    req.policyNo = this.processPartialWithdrawalReq.policyNo;
    req.perNo = this.processPartialWithdrawalReq.perno;
    req.lobSrc = Lob.LIFE;

    this.getPartialWithdrawService.getPartialAmount(req, (resp: GeneratePartialAmountResp) => {
      this.processPartialWithdrawalReq.netValue = resp.netValue;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getPartialAmount();
          }
        })
      });
  }

  proceedClicked() {
    // check condition for pension lob
    // if (true) {
    //   this.navCtrl.push(AddNewBankPage, { 'policyData': this.policyData, 'processPartialWithdrawalData': this.processPartialWithdrawalReq });
    // }
    // else {
    //   this.navCtrl.push(PartialWithdrawPayoutPage, { 'policyData': this.policyData, 'processPartialWithdrawalData': this.processPartialWithdrawalReq });
    // }
    this.navCtrl.push(PartialWithdrawPayoutPage, { 'policyData': this.policyData, 'processPartialWithdrawalData': this.processPartialWithdrawalReq });

  }

  rangeSlider(event) {
    // console.log(event.value);
  }

  goToWithdrawHistory() {
    this.navCtrl.push(PartialWithdrawHistoryPage);
  }

}
