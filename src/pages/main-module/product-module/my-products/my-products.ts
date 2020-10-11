import { StatusCode, Lob } from './../../../../common/enums/enums';
import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { PageSegmentInterface } from '../../../../common/interfaces/page-segment.interface';
import { ProductTag, LocalStorageKey, EventsName } from '../../../../common/enums/enums';
import { LogonService } from '../../../../providers/services/auth/logon.service';
import { PageInterface } from './../../dashboard-module/menu-navigation/menu-navigation';
import { LoaderService } from './../../../../providers/plugin-services/loader.service';
import { AllAccountsReq, AllAccountsResp } from '../../../../dataModels/all-accounts.model';
import { GetAllAccountsService } from '../../../../providers/services/main-module-services/product-services/all-accounts.service';
import { AccountList } from '../../../../dataModels/account-list.model';
import { LifeDetailsPage } from '../life/life-details/life-details';
import { AmcDetailsPage } from '../amc/amc-details/amc-details';
import { GiDetailsPage } from '../gi/gi-details/gi-details';
import { ActionItemsReq, ActionItemsResp } from '../../../../dataModels/product-action-items.model';
import { ActionItemsService } from '../../../../providers/services/main-module-services/product-services/action-items-services';
import { Utils } from '../../../../common/utils/utils';
import { ContactUsPage } from '../../../common-pages/contact-us/contact-us';
import { AlertService } from '../../../../providers/plugin-services/alert.service';
import { PensionDetailsPage } from '../pension/pension-details/pension-details';
import { CustomFirebaseAnalyticsProvider } from '../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { AmcAccountHoldingsReq, AmcAccountHoldingsResp } from '../../../../dataModels/amc-account-holdings.model';
import { AmcAccountHoldingsService } from '../../../../providers/services/main-module-services/product-services/amc-services/amc-tabs/amc-account-holdings.service';
import { AccountDetails } from '../../../../dataModels/account-details.model';
import { PageTrack } from '../../../../common/decorators/page-track';
import { BeneficiaryDetailsPage } from '../pension/beneficiary/beneficiary-details/beneficiary-details';
import { PensionAccountDetailsReq, PensionAccountDetailsResp } from '../../../../dataModels/pension-account-details.model';
import { GetPensionAccountDetailsService } from '../../../../providers/services/main-module-services/product-services/pension-services/pension-details/get-pension-account-details.service';

export enum ProductType {
    ALL = 'All',
    LIFE = 'Life Insurance',
    AMC = 'Investments',
    PENSION = 'Pension',
    GI = 'General Insurance',
    MP = 'Make Payment',
    SR = 'Service Request'
}

@PageTrack()
@IonicPage()
@Component({
    selector: 'page-my-products',
    templateUrl: 'my-products.html',
})
export class MyProductsPage implements OnDestroy {

    products: PageSegmentInterface[];

    selectedTag: ProductTag;
    selectedSegmentName: string;
    headerTitle: string;
    pageFlow: PageInterface;
    fromPayNow: boolean;
    paymentListCount: number = 0;
    hasListData: boolean = false;
    accountsList: AccountList[] = [];

    allAccountsList: AccountList[] = [];
    lifeAccountsList: AccountList[] = [];
    amcAccountsList: AccountList[] = [];
    giAccountsList: AccountList[] = [];
    pensionAccountsList: AccountList[] = [];

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public logonService: LogonService,
        public getAllAccountsService: GetAllAccountsService,
        public actionItemsService: ActionItemsService,
        public events: Events,
        public loader: LoaderService,
        public alert: AlertService,
        private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider,
        private amcAccountHoldingService: AmcAccountHoldingsService,
        public getPensionAccDetailsService: GetPensionAccountDetailsService,
    ) {
        this.pageFlow = this.navParams.get('pageFlow');
        this.selectedTag = this.navParams.get('selectedTag');
        this.setupPage();
    }

    ngOnDestroy(): void {
        console.log('ngOnDestroy MyProductsPage---------');
        localStorage.removeItem(LocalStorageKey.PageFlow);
        this.events.unsubscribe(EventsName.PayNowClicked);
        this.events.unsubscribe(EventsName.PaymentListCount);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad MyProductsPage');
        this.getAllAccountsList();

        // Firebase Analytics 'screen_view' event tracking
        this.customFirebaseAnalytics.trackView('MyProductsPage');
    }

    setupPage() {
        // this.products = [
        // // { name: ProductType.ALL, selectedTag: ProductTag.ALL },
        // { name: ProductType.LIFE, selectedTag: ProductTag.LIFE },
        // { name: ProductType.AMC, selectedTag: ProductTag.AMC },
        // { name: ProductType.GI, selectedTag: ProductTag.GI },
        // ];
        // this.getSegment(this.products[0].selectedTag);

        if (this.pageFlow && this.pageFlow.id == 'PayNow') {
            this.products = [
                // { name: ProductType.ALL, selectedTag: ProductTag.ALL },
                { name: ProductType.LIFE, selectedTag: ProductTag.LIFE },
                // { name: ProductType.AMC, selectedTag: ProductTag.AMC },
                // { name: ProductType.GI, selectedTag: ProductTag.GI },
                { name: ProductType.PENSION, selectedTag: ProductTag.PENSION },

            ];

            this.headerTitle = 'Pay Now';
            localStorage.setItem(LocalStorageKey.PageFlow, 'PayNow');
            this.fromPayNow = true;
            this.events.subscribe(EventsName.PaymentListCount, (length) => {
                console.log("--------", length);
                this.paymentListCount = length;
            })
        }
        else {
            this.products = [
                { name: ProductType.ALL, selectedTag: ProductTag.ALL },
                { name: ProductType.LIFE, selectedTag: ProductTag.LIFE },
                { name: ProductType.AMC, selectedTag: ProductTag.AMC },
                { name: ProductType.GI, selectedTag: ProductTag.GI },
                { name: ProductType.PENSION, selectedTag: ProductTag.PENSION },
            ];
            // this.products.unshift(
            // { name: ProductType.ALL, selectedTag: ProductTag.ALL }
            // )
            this.headerTitle = 'My Products'
            localStorage.removeItem(LocalStorageKey.PageFlow);
            this.fromPayNow = false;
            this.events.unsubscribe(EventsName.PaymentListCount);
        }
        this.segmentToSelect(this.selectedTag);
    }

    getAllAccountsList() {
        let req = new AllAccountsReq();
        req.nationalID = localStorage.getItem(LocalStorageKey.NationalID);
        req.lobSrc = '';

        this.getAllAccountsService.getAllAccounts(req, (resp: AllAccountsResp) => {
            if (resp && resp.allAccountsList.length > 0) {
                this.allAccountsList = resp.allAccountsList;
                this.allAccountsList.sort(function (a, b) { return a.status.toLowerCase() == 'active' && b.status.toLowerCase() != 'active' ? -1 : 1; })
                this.segmentToSelect(this.selectedTag)

                for (var i = 0; i < resp.allAccountsList.length; i++) {
                    if (this.allAccountsList[i].lobSrc.toLowerCase() == "asset") {
                        this.getAmcProductCode(i).then((productObj: any) => {
                            this.allAccountsList[productObj.index].productCode = productObj.accountDetail.productCode;
                           this.allAccountsList[productObj.index].canSwitchAndWithdraw=productObj.resp.canSwitchAndWithdraw;
                           this.allAccountsList[productObj.index].reason=productObj.resp.reason;

                            this.getActions(productObj.index);
                        }).catch(index=>{
                          this.allAccountsList[index].productCode = "";
                            this.getActions(index);
                        });
                    }
                    else {
                        this.getActions(i);
                    }
                }
                this.hasListData = true;
            } else {
                this.hasListData = true;
            }

        },
            (err: boolean) => {
                this.logonService.getToken((isTokenValid: boolean) => {
                    if (isTokenValid) {
                        this.getAllAccountsList();
                    }
                })
            });
    }

    getActions(index) {
        this.pushIntoAccountList(this.allAccountsList[index].lobSrc.toLowerCase(), this.allAccountsList[index]);

        if (localStorage.getItem(LocalStorageKey.PageFlow) == 'PayNow') {
            return;
        }

        let reqData = new ActionItemsReq();
        reqData.productCode = this.allAccountsList[index].productCode;
        reqData.lobSrc = Utils.getLobID(this.allAccountsList[index].lobSrc);

        this.actionItemsService.getActionItems(reqData, (resp: ActionItemsResp) => {
            this.allAccountsList[index].actionItemsResp.fundsList = resp.fundsList;
            this.pushIntoAccountList(this.allAccountsList[index].lobSrc.toLowerCase(), this.allAccountsList[index]);
        },
            (err: boolean) => {
                this.logonService.getToken((isTokenValid: boolean) => {
                    if (isTokenValid) {
                        this.getActions(index);
                    }
                })
            });
    }

    pushIntoAccountList(lob: string, account: AccountList) {
        if (lob == 'life') {
            var index1 = this.lifeAccountsList.indexOf(account);
            if (this.lifeAccountsList.indexOf(account) > -1) {
                this.lifeAccountsList.splice(index1, 1);
            }

            this.lifeAccountsList.push(account);
        }
        else if (lob == 'gi') {
            var index2 = this.giAccountsList.indexOf(account);
            if (index2 > -1) {
                this.giAccountsList.splice(index2, 1);
            }

            this.giAccountsList.push(account);
        }
        else if (lob == 'asset') {
            var index3 = this.amcAccountsList.indexOf(account);
            if (index3 > -1) {
                this.amcAccountsList.splice(index3, 1);
            }

            this.amcAccountsList.push(account);
        }
        else if (lob == 'pension') {
            var index4 = this.pensionAccountsList.indexOf(account);
            if (index4 > -1) {
                this.pensionAccountsList.splice(index4, 1);
            }

            this.getPensionPolicyDetails(account)
            this.pensionAccountsList.push(account);
        }
    }

    getAmcProductCode(index: number) {
        return new Promise((resolve, reject) => {
            let reqData = new AmcAccountHoldingsReq();
            reqData.accountNumber = this.allAccountsList[index].accountNumber;//"BA02600";
            reqData.formatted=false;

            this.amcAccountHoldingService.getHoldings(reqData, (resp: AmcAccountHoldingsResp) => {
                resolve({accountDetail: resp.amcFunds[0], index: index,resp:resp});
            }, (err) => {
              if (err.status == StatusCode.Status403) {
                this.logonService.getToken((isTokenValid: boolean) => {
                  if (isTokenValid) {
                    this.getAmcProductCode(index);
                  }
                })
              }
              else {
                reject(index);
              }
            })
        });
    }

    segmentToSelect(value?: ProductTag) {
        console.log('value: ', value);
        this.selectedTag = value;

        if (!value) {
            value = this.products[0].selectedTag;
        }
        switch (value) {
            case ProductTag.ALL:
                this.accountsList = this.allAccountsList;
                this.selectedSegmentName = ProductType.ALL;
                break;
            case ProductTag.LIFE:
                this.accountsList = this.lifeAccountsList;
                this.selectedSegmentName = ProductType.LIFE;
                break;
            case ProductTag.GI:
                this.accountsList = this.giAccountsList;
                this.selectedSegmentName = ProductType.GI;
                break;
            case ProductTag.AMC:
                this.accountsList = this.amcAccountsList;
                this.selectedSegmentName = ProductType.AMC;
                break;
            case ProductTag.PENSION:
                // dummy implementation;
                // this.accountsList.push(new AccountList({ accountNumber: '40098002', productName: 'INDIVIDUAL PENSION PLAN', lobSrc: 'pension', status: 'active' }));
                this.accountsList = this.pensionAccountsList;
                this.selectedSegmentName = ProductType.PENSION;
                break;

            default:
                console.log('getSegment not found -> ', value);
                break;
        }

    }

    goToAccountDetails(account: AccountList) {
        switch (account.lobSrc.toLowerCase()) {
            case 'life':
                this.navCtrl.push(LifeDetailsPage, { data: account, productTag: ProductTag.LIFE });
                break;
            case 'gi':
                this.navCtrl.push(GiDetailsPage, { data: account, productTag: ProductTag.GI });
                break;
            case 'asset':
                this.navCtrl.push(AmcDetailsPage, { data: account, productTag: ProductTag.AMC });
                break;
            case 'pension':
                this.navCtrl.push(PensionDetailsPage, { data: account, productTag: ProductTag.PENSION });
                break;

            default:
                console.log('Error goToAccountDetails -> ', account);
                break;
        }
    }

    getPensionPolicyDetails(account: AccountList) {
        let reqData = new PensionAccountDetailsReq();
        reqData.accountDetailReq.accountNumber = account.accountNumber;
        reqData.accountDetailReq.lobSrc = Lob.PENSION;
        reqData.accountDetailReq.formatted = false;

        this.getPensionAccDetailsService.getAccountDetails(reqData, (resp: PensionAccountDetailsResp) => {
            account.dueDate = resp.pensionDetailsObj.last_date_paid;
            let status = resp.pensionDetailsObj.membership_status;
            if (status == "ACTIVE" || status == "DEFEERED" || status == "NOTIFIED") {
                account.status = "active";
            }
            else {
                account.status = "inactive"
            }
        },
            (err: boolean) => {
                this.logonService.getToken((isTokenValid: boolean) => {
                    if (isTokenValid) {
                        this.getPensionPolicyDetails(account);
                    }
                })
            });
    }

    payNowClicked() {
        this.events.publish(EventsName.PayNowClicked);
    }

    requestCallBack() {
        let alertTitle = "";
        let alertMsg = "Kindly fill out the request form and we will contact you in 24 hours.";
        let cancelTxt = "CANCEL";
        let successTxt = "OK";
        this.alert.Alert.confirm(alertMsg, alertTitle, cancelTxt, successTxt).then(res => {
            this.navCtrl.push(ContactUsPage);
        }, err => {

        });
    }


}
