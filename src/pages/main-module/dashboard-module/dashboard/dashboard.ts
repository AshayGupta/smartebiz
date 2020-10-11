import { DashboardResp } from './../../../../dataModels/dashboard.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ImgsPath } from '../../../../common/constants/constants';
import { DashboardReq } from '../../../../dataModels/dashboard.model';
import { AccountsCountService } from '../../../../providers/services/main-module-services/product-services/get-products-count';
import { LocalStorageKey, ClientDetailsStorageKey, ProductTag } from '../../../../common/enums/enums';
import { LogonService } from '../../../../providers/services/auth/logon.service';
import { ClientDetailsService } from '../../../../providers/services/main-module-services/product-services/client-details.service';
import { ClientDetailsReq, ClientDetailsResp } from '../../../../dataModels/client-details.model';
import { MyProductsPage } from '../../../main-module/product-module/my-products/my-products';
import { CustomFirebaseAnalyticsProvider } from '../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../../common/decorators/page-track';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  headerImg: string = ImgsPath.britamLogo;
  dashboardResp = new DashboardResp();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public getAccountsCount: AccountsCountService,
    public clientDetailsService: ClientDetailsService,
    public logonService: LogonService,private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('Dashboard');

    this.getLifeClientDetails();
    this.getCRMClientDetails();
    this.getAccountsCounts();
  }


  getAccountsCounts() {
    let req = new DashboardReq();
    req.nationalID = localStorage.getItem(LocalStorageKey.NationalID);
    req.LobSrc = '';

    this.getAccountsCount.getAccountsCount(req, (resp: DashboardResp) => {
      this.dashboardResp = resp;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getAccountsCounts();
          }
        })
      });
  }


  getLifeClientDetails() {
    let perno = localStorage.getItem(ClientDetailsStorageKey.PersonNo)
    if (perno) return;

    let reqData = new ClientDetailsReq();
    reqData.nationalIdNumber = localStorage.getItem(LocalStorageKey.NationalID);//'8951392';
    reqData.lobSrc = '4'; // dynamic from category basis

    this.clientDetailsService.getClientDetails(reqData, (resp: ClientDetailsResp) => {
      localStorage.setItem(ClientDetailsStorageKey.PersonNo, resp.personNo);
      localStorage.setItem(ClientDetailsStorageKey.PassportNumber, resp.passportNumber);
      localStorage.setItem(ClientDetailsStorageKey.PinNumber, resp.pinNumber);
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getLifeClientDetails();
          }
        })
      });
  }

  getCRMClientDetails() {
    let reqData = new ClientDetailsReq();
    reqData.nationalIdNumber = localStorage.getItem(LocalStorageKey.NationalID);//'8951392';
    reqData.lobSrc = '';

    this.clientDetailsService.getClientDetails(reqData, (resp: ClientDetailsResp) => {
      localStorage.setItem(ClientDetailsStorageKey.Salutation, resp.salutation);
      localStorage.setItem(ClientDetailsStorageKey.FirstName, resp.firstName);
      localStorage.setItem(ClientDetailsStorageKey.MiddleName, resp.middleName);
      localStorage.setItem(ClientDetailsStorageKey.LastName, resp.surname);
      localStorage.setItem(ClientDetailsStorageKey.DateOfBirth, resp.dateOfBirth);
      localStorage.setItem(ClientDetailsStorageKey.Nationality, resp.nationality);
      localStorage.setItem(ClientDetailsStorageKey.Gender, resp.gender);
      localStorage.setItem(ClientDetailsStorageKey.PersonStatus, resp.personStatus);
      localStorage.setItem(ClientDetailsStorageKey.PersonStatus, resp.contactId);
      localStorage.setItem(ClientDetailsStorageKey.PhoneNumber, resp.contacts[0].mobile);
      localStorage.setItem(ClientDetailsStorageKey.msisdn, resp.contacts[0].mobile);
      localStorage.setItem(ClientDetailsStorageKey.Email, resp.contacts[0].email);
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getCRMClientDetails();
          }
        })
      });
  }

  gotoMyProduct(tag: string) {
    let productTag;
    // let count = '0';

    switch (tag) {
      case 'life':
        productTag = ProductTag.LIFE;
        // count = this.dashboardResp.LIFECount;
        break;
      case 'gi':
        productTag = ProductTag.GI;
        // count = this.dashboardResp.GICount;
        break;
      case 'pension':
        productTag = ProductTag.PENSION;

        break;
      case 'amc':
        productTag = ProductTag.AMC;
        // count = this.dashboardResp.AMCCount;
        break;

      default:
        break;
    }

    // if (count > '0') {
      // this.navCtrl.push(MyProductsPage, { 'selectedTag': productTag });
      this.navCtrl.setRoot(MyProductsPage, { 'selectedTag': productTag });
    // }

  }

}
