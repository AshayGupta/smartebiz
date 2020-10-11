import { SwitchPage } from './../../buy-product-module/switch-funds/switch/switch';
import { WithdrawPage } from './../../buy-product-module/withdraw-funds/withdraw/withdraw';
import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, FabContainer } from 'ionic-angular';
import { AccountList } from '../../../../dataModels/account-list.model';
import { ApplyLoanPage } from '../../loan-module/apply-loan/apply-loan';
import { ApplyPartialwithdrawPage } from './../../partial-withdraw-module/apply-partial-withdraw/apply-partial-withdraw';
import { LocalStorageKey, EventsName, Lob, ProductTag, StatusCode } from '../../../../common/enums/enums';
import { PayNowScreenPage } from './../../pay-now-module/pay-now-screen/pay-now-screen';
import { PaymentList } from '../../../../dataModels/make-payment.model';
import { RaiseRequestPage } from '../../service-request-module/raise-request/raise-request';
import { LogonService } from '../../../../providers/services/auth/logon.service';
import { Utils } from './../../../../common/utils/utils';
import { PensionPaynowPage } from '../../pay-now-module/pension-paynow/pension-paynow';
import { CustomFirebaseAnalyticsProvider } from '../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { AddFundsPage } from '../../buy-product-module/topup-funds/add-funds/add-funds';
import { PageTrack } from '../../../../common/decorators/page-track';
import { BeneficiaryDetailsPage } from '../pension/beneficiary/beneficiary-details/beneficiary-details';
import { ViewStatementPage } from '../pension/view-statement/view-statement';
import { PageInterface } from '../../dashboard-module/menu-navigation/menu-navigation';
import { MyProductsPage } from '../my-products/my-products';
import { ApplyInitialwithdrawPage } from '../pension/initial-withdraw-module/apply-initial-withdraw/apply-initial-withdraw';
import { AmcAccountHoldingsReq, AmcAccountHoldingsResp } from '../../../../dataModels/amc-account-holdings.model';
import { AlertService } from '../../../../providers/plugin-services/alert.service';
import { AmcAccountHoldingsService } from '../../../../providers/services/main-module-services/product-services/amc-services/amc-tabs/amc-account-holdings.service';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-my-product-screen',
  templateUrl: 'my-product-screen.html',
})
export class MyProductScreenPage {

  @Input('inputData') inputData: AccountList[];
  @Input('selectedTag') selectedTag: string;
  @Output('outputData') outputData = new EventEmitter();
  fab: FabContainer;

  paymentList: PaymentList[] = [];
  fromPayNow: boolean;
  amcAccountHoldingService: any;

  constructor(
    public navCtrl: NavController, public logonService: LogonService,
    public navParams: NavParams,
    public alertService: AlertService,
    public events: Events,
    public amcAccountHolding: AmcAccountHoldingsService,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider
  ) {
    this.setupPage();
  }

  ngOnChanges(changes: SimpleChanges) {
    // var accList: AccountList[] = changes.inputData.currentValue;
    if (this.fab) {
      this.fab.close();
    }

    let flow = localStorage.getItem(LocalStorageKey.PageFlow);
    flow == 'PayNow' ? this.fromPayNow = true : this.fromPayNow = false;

    if (this.fromPayNow) {
      this.paymentList = [];
      this.events.publish(EventsName.PaymentListCount, 0);
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyProductScreenPage');
    console.log(this.inputData);
    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('MyProductScreenPage');
  }

  setupPage() {
    let flow = localStorage.getItem(LocalStorageKey.PageFlow);
    flow == 'PayNow' ? this.fromPayNow = true : this.fromPayNow = false;

    if (this.fromPayNow) {
      this.events.publish(EventsName.PaymentListCount, 0);
      this.events.unsubscribe(EventsName.PayNowClicked);
      this.events.subscribe(EventsName.PayNowClicked, () => {
        this.goToPaymentList();
      })
    }
  }

  goToAccountDetails(data: AccountList) {
    if (this.fromPayNow) { }
    else {
      this.outputData.emit(data);
    }
  }

  selectCheckbox(event: any, accList: AccountList) {
    if (event.checked) {
      let list = new PaymentList();
      list.accountNumber = accList.accountNumber;
      list.accountName = accList.productName;
      list.lob = Utils.getLobID(accList.lobSrc);

      this.paymentList.push(list);
    } else {
      this.paymentList.filter((data: PaymentList) => {
        if (data.accountNumber == accList.accountNumber) {
          var index: number = this.paymentList.indexOf(data);
          if (index !== -1) {
            this.paymentList.splice(index, 1);
          }
        }
      });
    }
    console.log('PaymentList -> ', this.paymentList);
    this.events.publish(EventsName.PaymentListCount, this.paymentList.length);
  }


  applyLoanClicked(account: AccountList) {
    this.navCtrl.push(ApplyLoanPage, { policyData: account });
  }

  partialWithdrawClicked(account: AccountList) {
    this.navCtrl.push(ApplyPartialwithdrawPage, { policyData: account });
  }

  topupNowClicked(account: AccountList) {
    this.navCtrl.push(AddFundsPage, { policyData: account });
  }


  withdrawClicked(account: AccountList) {

    if (account.canSwitchAndWithdraw === "false") {

      let alertTitle = "Withdraw";
      let alertMsg = "Withdrawal feature is not available for jointly held accounts at the moment";
      let successTxt = "Ok";

      this.alertService.Alert.alert(alertMsg, alertTitle, successTxt).then(res => {
      },
        error => {
        });
    } else {
      this.navCtrl.push(WithdrawPage, { policyData: account });
    }

  }


  switchClicked(account: AccountList) {

    if (account.canSwitchAndWithdraw === "false") {
      let alertTitle = "Switch";
      let alertMsg = "Switch feature is not available for jointly held accounts at the moment";
      let successTxt = "Ok";

      this.alertService.Alert.alert(alertMsg, alertTitle, successTxt).then(res => {
      },
        error => {
        });

    }
    else {
      this.navCtrl.push(SwitchPage, { policyData: account });
    }
  }



  updateBeneficiaryClicked(account) {
    this.navCtrl.push(BeneficiaryDetailsPage, { policyData: account })
  }

  viewPolicyStatementClicked(account) {
    this.navCtrl.push(ViewStatementPage, { policyData: account })
  }

  pensionWithdrawClicked(account: AccountList) {
    this.navCtrl.push(ApplyInitialwithdrawPage, { policyData: account });
  }

  makeContributionClicked(account: AccountList) {
    let pages: PageInterface[] = [
      { id: 'PayNow', title: 'Pay Now', pageName: 'MyProductsPage', img: 'assets/imgs/accounts.png' },
    ];
    let params = { 'pageFlow': pages[0], 'selectedTag': ProductTag.PENSION };

    this.navCtrl.push(MyProductsPage, params);
  }

  serviceRequestClicked(account: AccountList) {
    this.navCtrl.push(RaiseRequestPage, { policyData: account });
  }


  goToPaymentList() {
    if (this.paymentList[0].lob == Lob.PENSION) {
      this.navCtrl.push(PensionPaynowPage, { 'PaymentList': JSON.stringify(this.paymentList) });
    }
    else {
      this.navCtrl.push(PayNowScreenPage, { 'PaymentList': JSON.stringify(this.paymentList) });
    }
  }

  ionFabClicked(fab: FabContainer) {
    if (this.fab === fab) {
      return;
    } else if (this.fab) {
      this.fab.close();
    }
    this.fab = fab;
  }


}
