import { AmcMongoStagesService } from './../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';
import { AmcMongoStagesReq, Stages, PayoutDetails } from './../../../../../dataModels/amc-mongo-stages.model';
import { WithdrawVerifyPage } from './../withdraw-verify/withdraw-verify';
import { BankAccountsService } from './../../../../../providers/services/main-module-services/bank-module-services/get-bank-accounts.service';
import { LogonService } from './../../../../../providers/services/auth/logon.service';
import { TopUpReq } from './../../../../../dataModels/top-up.model';
import { BankAccountsList, BankAccountsReq, BankAccountsResp } from './../../../../../dataModels/get-bank-accounts.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Item } from 'ionic-angular';
import { LocalStorageKey, Lob, ClientDetailsStorageKey, MongoAMCStaging } from '../../../../../common/enums/enums';
import { ClientDetailsService } from '../../../../../providers/services/main-module-services/product-services/client-details.service';
import { ClientDetailsReq, ClientDetailsResp, BankAccounts } from '../../../../../dataModels/client-details.model';

/**
 * Generated class for the WithdrawPayoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-withdraw-payout',
  templateUrl: 'withdraw-payout.html',
})
export class WithdrawPayoutPage {

  withdrawForm: FormGroup;
  submitAttempt: boolean = false;
  headerTitle: string = 'Select Payout';
  withdrawReq: TopUpReq = new TopUpReq();
  // bankAccountsList: BankAccountsList[] = [];
  bankAccountsList: BankAccounts[] = []
  amcMongoReq: AmcMongoStagesReq;
  stage: Stages = new Stages();
  bankPayoutList = [
    { name: 'BANK', value: 'BANK' },
    { name: 'MPESA', value: 'MPESA' },
  ]

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public logonService: LogonService,
    public bankAccountsService: BankAccountsService,
    public amcMongoStageService: AmcMongoStagesService,
    public clientDetailsService: ClientDetailsService,
  ) {
    this.withdrawReq = this.navParams.get('withdrawReq');
    this.amcMongoReq = this.navParams.get('amcMongoReq');

    this.validateForm();
  }

  validateForm() {
    if (this.withdrawReq.paymentMode != this.bankPayoutList[1].name) {
      this.withdrawForm = this.formBuilder.group({
        bankNumber: ['', Validators.compose([Validators.required])],
      });
    }
    else {
      this.withdrawForm = this.formBuilder.group({
      });
      // this.withdrawForm.controls.bankNumber.clearValidators();
      // this.withdrawForm.controls.bankNumber.updateValueAndValidity();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WithdrawPayoutPage');
    if (parseFloat(this.withdrawReq.amount) >= 70000) {
      // this.withdrawReq.PhoneNumber = '';
      this.bankPayoutList.splice(1, 1);
    }
    else {
      // this.withdrawReq.PhoneNumber = localStorage.getItem(ClientDetailsStorageKey.PhoneNumber);
    }
    this.withdrawReq.paymentMode = this.withdrawReq.paymentMode ? this.withdrawReq.paymentMode : this.bankPayoutList[0].value;
    // this.getBankAccounts();
    this.getClientDetailsWithLob();
  }

  getClientDetailsWithLob() {
    let reqData = new ClientDetailsReq();
    reqData.nationalIdNumber = this.withdrawReq.userDetails.idValue;//'8951392';
    reqData.lobSrc = Lob.AMC;

    this.clientDetailsService.getClientDetails(reqData, (resp: ClientDetailsResp) => {
      this.bankAccountsList = resp.bankAccounts.filter(item => {
        return item.bankName.toLowerCase() != 'm-pesa';
      });

      this.filterSelectPayout(resp);
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getClientDetailsWithLob();
          }
        })
      });
  }

  filterSelectPayout(clientDetailResp: ClientDetailsResp) {
    let hasMpesa = false;
    this.withdrawReq.mpesaBankNumber = "";
    clientDetailResp.bankAccounts.forEach(bank => {
      if (bank.bankName.toLowerCase() == 'm-pesa') {
        this.withdrawReq.mpesaBankNumber = bank.bankNumber;
        this.withdrawReq.PhoneNumber = bank.accountNumber.replace("254", "0");
        hasMpesa = true;
      }
    });

    if (!hasMpesa) {
      if (this.bankPayoutList.length > 1) {
        this.bankPayoutList.splice(1, 1);
      }
    }
  }


  selectBank(accountNumber: string) {
    this.bankAccountsList.filter((data) => {
      if (accountNumber == data.accountNumber) {
        this.withdrawReq.bankAccNo = data.accountNumber;
        this.withdrawReq.bankBranch = data.bankBranch;
        this.withdrawReq.accountName = data.accountName;
        this.withdrawReq.bankName = data.bankName;
        this.withdrawReq.bankNumber = data.bankNumber;
        this.withdrawReq.accountNumberId = data.accountNumberId;
      }
    })
  }

  payoutSelect(paymentMode: string) {
    if (paymentMode == this.bankPayoutList[0].name) {
      this.withdrawForm = this.formBuilder.group({
        bankNumber: ['', Validators.compose([Validators.required])],
      });
      // this.withdrawReq.mpesaBankNumber = "";
    }
    else {
      this.withdrawForm.controls.bankNumber.clearValidators();
      this.withdrawForm.controls.bankNumber.updateValueAndValidity();
      this.withdrawReq.bankBranch = ''
      this.withdrawReq.bankAccNo = ''
      this.withdrawReq.bankNumber = ''
      this.withdrawReq.bankName = ''
      this.withdrawReq.accountName = '';
      this.withdrawReq.accountNumberId = '';
    }
  }

  proceedClicked() {
    this.setMongoStage();
    this.navCtrl.push(WithdrawVerifyPage, { 'withdrawReq': this.withdrawReq, 'amcMongoReq': this.amcMongoReq });
  }

  setMongoStage() {
    this.amcMongoReq.cp_amc_withdrawal.stages.filter(item => {
      if (item.name == "Bank Details Add") {
        item.status = MongoAMCStaging.Done;
      }
    });

    let payoutDetails = new PayoutDetails();
    if (this.withdrawReq.paymentMode == this.bankPayoutList[0].name) {
      payoutDetails.bankId = this.withdrawReq.bankNumber;
      payoutDetails.branchName = this.withdrawReq.bankBranch;
      payoutDetails.bankName = this.withdrawReq.bankName;
      payoutDetails.bankAccountNo = this.withdrawReq.bankAccNo;
      payoutDetails.accountHolderName = this.withdrawReq.accountName;
      payoutDetails.payoutMethod = "BANK";

    } else {
      payoutDetails.mobileNumber = this.withdrawReq.PhoneNumber;
      // payoutDetails.bankAccountNo = this.withdrawReq.mpesaBankNumber
      payoutDetails.payoutMethod = "MPESA";
    }
    this.amcMongoReq.cp_amc_withdrawal.payoutDetails = payoutDetails;

    this.amcMongoStageService.updateAmcMongoStage(this.amcMongoReq, (resp: any) => {
    });
  }

}
