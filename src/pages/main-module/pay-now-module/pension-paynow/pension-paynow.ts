import { UserDetails } from './../../../../dataModels/user-details.model';
import { AmcMongoStagesService } from './../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';
import { MongoAMCStaging, MongoSourceTag, ChannelTag } from './../../../../common/enums/enums';
import { GetTransactionNumberService } from './../../../../providers/services/main-module-services/buy-product-module-services/get-transaction-number.service';
import { GetTransactionNumberReq, GetTransactionNumberResp } from './../../../../dataModels/get-transaction-number.model';
import { Utils } from './../../../../common/utils/utils';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, TextInput } from 'ionic-angular';
import { LogonService } from './../../../../providers/services/auth/logon.service';
import { MakePaymentReq, PaymentList, PostedAmounts } from '../../../../dataModels/make-payment.model';
import { ClientDetailsStorageKey, LocalStorageKey, Lob } from '../../../../common/enums/enums';
import { AlertService } from '../../../../providers/plugin-services/alert.service';
import { PensionPaynowSummaryPage } from '../pension-paynow-summary/pension-paynow-summary';
import { CustomFirebaseAnalyticsProvider } from '../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { AmcMongoStagesReq, Stages } from '../../../../dataModels/amc-mongo-stages.model';
import { RegexPattern } from '../../../../common/constants/constants';



@IonicPage()
@Component({
  selector: 'page-pension-paynow',
  templateUrl: 'pension-paynow.html',
})
export class PensionPaynowPage {

  headerTitle: string = 'Pay Now';
  paymentList: PaymentList[] = [];
  paymentReq = new MakePaymentReq();
  amount: string = "0";
  transactionNumber: string;
  amcMongoReq: AmcMongoStagesReq = new AmcMongoStagesReq();
  mongoStages: Stages[] = [{
    name: "Selection of policy",
    status: MongoAMCStaging.Done,
  },
  {
    name: "Calculation of Amount",
    status: MongoAMCStaging.Done
  },
  {
    name: "MPesa",
    status: MongoAMCStaging.Pending
  },
  {
    name: "SR-CREATED",
    status: MongoAMCStaging.Pending
  }];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public logonService: LogonService,
    public alertService: AlertService,
    public getTransactionNumberService: GetTransactionNumberService,
    private amcMongoStagesService: AmcMongoStagesService,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider
  ) {
    let temp = this.navParams.get('PaymentList')
    this.paymentList = JSON.parse(temp);
    console.log(`this.paymentList=========`, this.paymentList);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PensionPaynowPage');

    this.getTransactionNumber().then((resp: GetTransactionNumberResp) => {
      this.transactionNumber = resp.transactionNumber;
    });
    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('PensionPaynowPage');
  }

  getTransactionNumber(): Promise<GetTransactionNumberResp> {
    return new Promise((resolve, reject) => {
      let req = new GetTransactionNumberReq();
      req.transactionType = "MakePayment";
      req.policyNumber = this.paymentList[0].accountNumber;

      this.getTransactionNumberService.getTransactionNumber(req, (resp) => {
        resolve(resp)
      });
    });
  }

  inputExcessAmt(event: TextInput) {
    if (RegexPattern.exceptZeroToNine.test(event.value)) {
      let input = event.value.replace(RegexPattern.exceptZeroToNine,'')
      event.value = input;
      return;
    }
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


  proceedToPayClicked() {
    this.paymentReq.userDetails.idType = localStorage.getItem(LocalStorageKey.NationalIDType);
    this.paymentReq.userDetails.idValue = localStorage.getItem(LocalStorageKey.NationalID);
    this.paymentReq.firstName = localStorage.getItem(ClientDetailsStorageKey.FirstName);
    this.paymentReq.lastName = localStorage.getItem(ClientDetailsStorageKey.LastName);
    this.paymentReq.middleName = localStorage.getItem(ClientDetailsStorageKey.MiddleName);
    this.paymentReq.msisdn = localStorage.getItem(ClientDetailsStorageKey.msisdn);
    this.paymentReq.lobSrc = Lob.PENSION;
    this.paymentReq.email = localStorage.getItem(ClientDetailsStorageKey.Email);

    let phone = Utils.removeNull(localStorage.getItem(ClientDetailsStorageKey.PhoneNumber));
    this.paymentReq.phoneNumber = phone.replace("+", "").replace(/^0+/, '254'); //'254711535989'

    this.paymentReq.paybillNumber = '827142'; //localStorage.getItem(ClientDetailsStorageKey.paybillNumber);

    this.paymentReq.transactionNumber = this.transactionNumber;
    this.paymentReq.transactionType = "pensionMakeContribution";
    this.paymentReq.action = "MakePayment";
    this.paymentReq.policyNo = this.paymentReq.accountNumber;
    
    this.paymentReq.accountNumber = '';
    this.paymentReq.postedAmount = [];

    for (var i = 0; i < this.paymentList.length; i++) {
      let amt = new PostedAmounts();
      amt.accountNumber = this.paymentList[i].accountNumber;
      amt.amount = Utils.ceilValue(this.paymentList[i].excessAmount).toString();
      this.paymentReq.postedAmount.push(amt);

      this.paymentReq.accountNumber += this.paymentList[i].accountNumber;
      if (i != this.paymentList.length - 1) {
        this.paymentReq.accountNumber += ',';
      }

      this.paymentReq.Summary = "PolicyNumber: "+this.paymentList[i].accountNumber+",Total Amount: "+this.paymentReq.amount;
    }

    this.presentPaynowModal();
  }

  presentPaynowModal() {
    console.log('paymentReq -> ', this.paymentReq);
    console.log('paymentList -> ', this.paymentList);

    localStorage.setItem(LocalStorageKey.PageFlow, "PensionPayNow");

    this.mongoStages.filter(item => {
      if (item.name == "Calculation of Amount") {
        item.status = MongoAMCStaging.Done;
      }
    });
    this.updateMongoStages()

    this.navCtrl.push(PensionPaynowSummaryPage, { 
      'paymentList': this.paymentList, 
      'paymentReq': this.paymentReq, 
      "amcMongoReq": this.amcMongoReq 
    });
  }


  // ------------- LOGIC -------------- //

  calculateTotalAmount() {
    let sum = 0;
    for (var i = 0; i < this.paymentList.length; i++) {
      this.calculateProductAmt(this.paymentList[i], i);
      sum += parseFloat(this.paymentList[i].productTotalAmount);
      sum = sum ? sum : 0;
    }
    this.amount = Utils.roundToDecimal(sum.toString(), 100);
    this.paymentReq.amount = this.amount.toString();
    console.log('paymentReq.amount', this.paymentReq.amount);
  }

  calculateProductAmt(list: PaymentList, index) {
    let totalAmount = 0;

    if (parseFloat(list.excessAmount) > 0) {
      totalAmount = totalAmount + parseFloat(list.excessAmount);
    }

    list.productTotalAmount = Utils.roundToDecimal(totalAmount.toString(), 100);
    if (list.productTotalAmount == 'NaN' || parseFloat(list.productTotalAmount) <= 0) {
      list.productTotalAmount = '0.0';
    }

  }
  
  updateMongoStages() {
    let userDetails = new UserDetails();
    userDetails.idType = localStorage.getItem(LocalStorageKey.NationalIDType);
    userDetails.idValue = localStorage.getItem(LocalStorageKey.NationalID);

    let policyDetails = {
      policyNo: ""
    };

    let calculatedAmount: Array<any> = [];
    this.paymentList.forEach((postedAmount) => {
      let calculate = {
        contributionAmount: postedAmount.excessAmount,
        policyNumber: postedAmount.accountNumber
      };
      calculatedAmount.push(calculate);
    });

    this.amcMongoReq.cp_pension_makecontribution = {};

    this.amcMongoReq["collection"] = "cp_pension_makecontribution";
    this.amcMongoReq.cp_pension_makecontribution["source"] = MongoSourceTag.MOBILEAPP
    this.amcMongoReq.cp_pension_makecontribution["channel"] = ChannelTag.MOBILE;
    this.amcMongoReq.cp_pension_makecontribution["TargetLob"] = "Pension",
    this.amcMongoReq.cp_pension_makecontribution["transactionId"] = 'TR_' + Utils.autoIncID();
    this.amcMongoReq.cp_pension_makecontribution["stages"] = this.mongoStages;
    this.amcMongoReq.cp_pension_makecontribution["policyDetails"] = policyDetails;
    this.amcMongoReq.cp_pension_makecontribution["userDetails"] = userDetails;
    this.amcMongoReq.cp_pension_makecontribution["calculatedAmount"] = calculatedAmount;
    this.amcMongoReq.cp_pension_makecontribution["Mobile"] = localStorage.getItem(ClientDetailsStorageKey.PhoneNumber);

    this.amcMongoStagesService.createAmcMongoStage(this.amcMongoReq, (resp) => {
      this.amcMongoReq["mongoId"] = resp.id;
    })
  }


}
