import { ApiUrl } from './../../../../../common/constants/constants';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { GetProductService } from '../../../../../providers/services/main-module-services/buy-product-module-services/get-product.service';
import { KnowYourCustomerPage } from '../know-your-customer/know-your-customer';
import { ActionItemsReq, ActionItemsResp, FundsList } from '../../../../../dataModels/product-action-items.model';
import { BuyProductReq, Investment } from '../../../../../dataModels/buy-product-model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LogonService } from '../../../../../providers/services/auth/logon.service';
import { Lob } from '../../../../../common/enums/enums';

@IonicPage()
@Component({
  selector: 'page-market-funds',
  templateUrl: 'market-funds.html',
})
export class MarketFundsPage {

  headerTitle: string = "Invest in Britam Funds";
  buyProductReq: BuyProductReq = new BuyProductReq();
  fundList: FundsList[];
  policyUrl = ApiUrl.profileImgUrl + '/buyonline-onboarding?applynow=customer&selectedFund=';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public getProductService: GetProductService,
    private iab: InAppBrowser,
    public logonService: LogonService
  ) {
    //this.headerTitle = this.navParams.get('headerTitle');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MarketFundsPage');
    this.getFunds();
  }

  getFunds() {
    let reqData = new ActionItemsReq();
    reqData.lobSrc = Lob.AMC;

    this.getProductService.getProduct(reqData, (resp: ActionItemsResp) => {
      this.fundList = resp.fundsList.sort(function (a, b) { return parseInt(a.productOrdering) > parseInt(b.productOrdering) ? 1 : -1; });
    },
      (err: HttpErrorResponse) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getFunds();
          }
        })
      });
  }

  selectFund(fund: FundsList) {
    let investment: Investment = new Investment();
    investment.selectedFund = fund;

    this.buyProductReq.investment = investment;
    this.buyProductReq.lobSrc = Lob.AMC;

    this.navCtrl.push(KnowYourCustomerPage, { "buyProductReq": this.buyProductReq });
  }

  // downloadPolicy(fund:FundsList){
  //   let opts : string = "location=yes,clearcache=yes,hidespinner=no"
  //   this.iab.create(this.policyUrl+fund.productName, '_system', opts);
  // }

}
