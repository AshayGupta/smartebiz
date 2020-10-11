import { Utils } from './../../../../common/utils/utils';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { GetPremiumDueService } from './../../../../providers/services/main-module-services/pay-now-module-services/get-premium-due.service';
import { PremiumDueResp, PremiumDueReq } from '../../../../dataModels/premium-due.model';
import { LogonService } from './../../../../providers/services/auth/logon.service';
import { MakePaymentReq, PaymentList, PostedAmounts } from '../../../../dataModels/make-payment.model';
import { ClientDetailsStorageKey, LocalStorageKey } from '../../../../common/enums/enums';
import { PaynowSummaryPage } from './../pay-now-summary/pay-now-summary';
import { AlertService } from '../../../../providers/plugin-services/alert.service';
import { CustomFirebaseAnalyticsProvider } from '../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../../common/decorators/page-track';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-pay-now-screen',
  templateUrl: 'pay-now-screen.html',
})
export class PayNowScreenPage {

  headerTitle: string = 'Pay Now';
  paymentList: PaymentList[] = [];
  paymentReq = new MakePaymentReq();
  premiumDueResp: PremiumDueResp[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public logonService: LogonService,
    public alertService: AlertService,
    public premiumDueService: GetPremiumDueService,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider

  ) {
    let temp = this.navParams.get('PaymentList')
    this.paymentList = JSON.parse(temp);//Object.assign([], JSON.parse(temp));
    console.log(`this.paymentList=========`, this.paymentList);
    this.getAccountsPremiumDue();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PayNowScreenPage');

      // Firebase Analytics 'screen_view' event tracking
      this.customFirebaseAnalytics.trackView('PayNowScreenPage');
  }

  count = 0;
  getAccountsPremiumDue() {
    for (var i = 0; i < this.paymentList.length; i++) {
      console.log('this.paymentList==', this.paymentList)

      let req = new PremiumDueReq();
      req.accountNumber = this.paymentList[i].accountNumber;  //'109-42187';
      req.personNumber = localStorage.getItem(ClientDetailsStorageKey.PersonNo); //'97190'
      req.siteAgentNumber = '';
      req.lobSrc = this.paymentList[i].lob;
      req.faID = '';
      req.index = i;

      this.premiumDueResp.push(new PremiumDueResp());

      this.premiumDueService.getPremiumDues(req, (resp: PremiumDueResp) => {
        this.premiumDueResp[req.index]=(JSON.parse(JSON.stringify(resp)));
        this.count++;
        console.log(`this.paymentList[i]==`, this.paymentList[req.index])
        this.paymentList[req.index].premiumAmount = resp.premiumAmount;
        this.paymentList[req.index].suspenseAmount = resp.suspenseAmount;
        this.paymentList[req.index].loanOutstanding = resp.loanOutstanding;

        if (this.count == this.paymentList.length){
          this.count = 0;
          this.calculateTotalAmount();
        }
      },
        (err: boolean) => {
          this.logonService.getToken((isTokenValid: boolean) => {
            if (isTokenValid) {
              this.getAccountsPremiumDue();
            }
          })
        });
    }
  }

  inputExcessAmt(list: PaymentList) {
    this.calculateTotalAmount();
  }

  deleteList(index) {
    let alertTitle: string = "";
    let alertMsg: string = "Do you really want to delete?";
    let cancelTxt: string = "NO";
    let successTxt: string = "YES";

    this.alertService.Alert.confirm(alertMsg, alertTitle, cancelTxt, successTxt).then(res => {
      this.deleteObjFromList(index);
    },
      error => {

      });
  }

  deleteObjFromList(index) {
    this.paymentList.splice(index, 1);
    if (this.paymentList.length == 0) {
      this.navCtrl.pop();
    } else {
      this.calculateTotalAmount();
    }
  }

  inputLoanAmt(event, index: number, j: number) {
    if (this.paymentList[index].loanOutstanding[j].amount == '') {
      this.paymentList[index].loanOutstanding[j].amount = '0';
    }
    else if(parseFloat(event.value) > parseFloat(this.premiumDueResp[index].loanOutstanding[j].amount)) {
      event.value = this.premiumDueResp[index].loanOutstanding[j].amount;
    }
    this.calculateTotalAmount();
  }

  onExcessCheckboxClicked(event, i) {
    if (!event.checked) {
      this.paymentList[i].excessCheckboxStatus = false;
    } else {
      this.paymentList[i].excessCheckboxStatus = true;
    }
    this.calculateTotalAmount();
  }

  onPreminumCheckboxClicked(event, i) {
    if (!event.checked) {
      this.paymentList[i].preminumCheckboxStatus = false;
    } else {
      this.paymentList[i].preminumCheckboxStatus = true;
    }
    this.calculateTotalAmount();
  }

  onLoanCheckboxClicked(event, i, j) {
    if (!event.checked) {
      this.paymentList[i].loanOutstanding[j].loanCheckboxStatus = false;
    } else {
      this.paymentList[i].loanOutstanding[j].loanCheckboxStatus = true;
    }
    this.calculateTotalAmount();
  }


  proceedToPayClicked() {
    this.paymentReq.userDetails.idType = localStorage.getItem(LocalStorageKey.NationalIDType);
    this.paymentReq.userDetails.idValue = localStorage.getItem(LocalStorageKey.NationalID);
    this.paymentReq.firstName = localStorage.getItem(ClientDetailsStorageKey.FirstName);
    this.paymentReq.lastName = localStorage.getItem(ClientDetailsStorageKey.LastName);
    this.paymentReq.middleName = localStorage.getItem(ClientDetailsStorageKey.MiddleName);
    this.paymentReq.lobSrc = '4';
    this.paymentReq.msisdn = localStorage.getItem(ClientDetailsStorageKey.msisdn);

    let phone = Utils.removeNull(localStorage.getItem(ClientDetailsStorageKey.PhoneNumber));
    this.paymentReq.phoneNumber = phone.replace("+", "").replace(/^0+/, '254'); //'254711535989'

    this.paymentReq.paybillNumber = '827142'; //localStorage.getItem(ClientDetailsStorageKey.paybillNumber);
    this.paymentReq.policyNo = this.paymentReq.accountNumber;

    this.paymentReq.postedAmount = [];
    this.paymentReq.accountNumber = '';

    for(var i=0; i<this.paymentList.length; i++) {
      if (this.paymentList[i].preminumCheckboxStatus) {
        let amt = new PostedAmounts();
        amt.accountNumber = this.paymentList[i].accountNumber;
        amt.amount = Utils.ceilValue(parseFloat(this.paymentList[i].premiumAmount) - parseFloat(this.paymentList[i].suspenseAmount)).toString();
        this.paymentReq.postedAmount.push(amt);
      }
      if (this.paymentList[i].excessCheckboxStatus) {
        let amt = new PostedAmounts();
        amt.accountNumber = this.paymentList[i].accountNumber;
        amt.amount = Utils.ceilValue(this.paymentList[i].excessAmount).toString();
        this.paymentReq.postedAmount.push(amt);
      }
      for (var loan of this.paymentList[i].loanOutstanding) {
        if (loan.type == 'APL' && loan.loanCheckboxStatus) {
          let amt = new PostedAmounts();
          amt.accountNumber = this.paymentList[i].accountNumber;
          amt.amount = Utils.ceilValue(loan.amount).toString();
          this.paymentReq.postedAmount.push(amt);
        }
        else if (loan.type == 'POL' && loan.loanCheckboxStatus) {
          let amt = new PostedAmounts();
          amt.accountNumber = 'L' + this.paymentList[i].accountNumber;
          amt.amount = Utils.ceilValue(loan.amount).toString();
          this.paymentReq.postedAmount.push(amt);
        }
      }

      this.paymentReq.accountNumber += this.paymentList[i].accountNumber;
      if (i != this.paymentList.length - 1){
        this.paymentReq.accountNumber += ',';
      }

      this.paymentReq.Summary = "PolicyNumber:-"+this.paymentList[i].accountNumber+"Excess Amount:-"+this.paymentList[i].excessAmount+"PremiumAmount:-"+this.paymentList[i].premiumAmount+"Total Amount:-"+this.paymentReq.amount;
    }

    console.log('paymentReq -> ', this.paymentReq);
    console.log('paymentList -> ', this.paymentList);

    this.presentPaynowModal();
  }

  roundOffAmount(amount: any) {
    amount = (Math.round(amount * 10) / 10);
    return amount;
  }

  presentPaynowModal() {
    // let options = {
    //   showBackdrop: true,
    //   enableBackdropDismiss: true,
    // };

    // let paynowModal = this.modalCtrl.create(PaynowSummaryPage, { 'paymentList': this.paymentList, 'paymentReq': this.paymentReq }, options);
    // paynowModal.present();
    this.navCtrl.push(PaynowSummaryPage, { 'paymentList': this.paymentList, 'paymentReq': this.paymentReq });
  }


  // ------------- LOGIC -------------- //

  calculateTotalAmount() {
    let sum = 0;
    for (var i = 0; i < this.paymentList.length; i++) {

      // if (Utils.isEmpty(this.paymentList[i].loanAmount) || parseFloat(this.paymentList[i].loanAmount) <= 0) {
      //   this.paymentList[i].showLoan = false;
      // } else {
      //   this.paymentList[i].showLoan = true;
      // }

      this.calculateProductAmt(this.paymentList[i], i);
      sum += parseFloat(this.paymentList[i].productTotalAmount);
      sum = sum ? sum : 0;
    }
    // this.paymentReq.amount = parseFloat(this.paymentReq.amount) > 0 ? this.paymentReq.amount : '0.0';
    this.paymentReq.amount = Utils.roundToDecimal(sum.toString(), 100);
    console.log('paymentReq.amount', this.paymentReq.amount);
  }

  calculateProductAmt(list: PaymentList, index) {
    let totalAmount = 0;
    if (list.premiumAmount && parseFloat(list.premiumAmount) > 0 && list.preminumCheckboxStatus) {
      totalAmount = parseFloat(list.premiumAmount);
      if (list.suspenseAmount && (parseFloat(list.premiumAmount) > parseFloat(list.suspenseAmount))) {
        totalAmount = totalAmount - parseFloat(list.suspenseAmount);
        totalAmount = Math.round(totalAmount * 100) / 100;
      }
    }

    for (var j = 0; j < list.loanOutstanding.length; j++) {
      if (list.loanOutstanding[j].loanCheckboxStatus) {
        totalAmount = totalAmount + (parseFloat(list.loanOutstanding[j].amount) > parseFloat(this.premiumDueResp[index].loanOutstanding[j].amount) ? parseFloat(this.premiumDueResp[index].loanOutstanding[j].amount) : parseFloat(list.loanOutstanding[j].amount));
      }
    }

    if (list.excessCheckboxStatus && parseFloat(list.excessAmount) > 0) {
      totalAmount = totalAmount + parseFloat(list.excessAmount);
    }

    list.productTotalAmount = Utils.roundToDecimal(totalAmount.toString(), 100);

    if (list.productTotalAmount == 'NaN' || parseFloat(list.productTotalAmount) <= 0) {
      list.productTotalAmount = '0.0';
    }

  }

}
