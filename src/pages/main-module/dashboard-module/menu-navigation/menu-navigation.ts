import { WelcomePage } from './../../../common-pages/welcome/welcome';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';
import { Logout } from '../../../../providers/services/auth/login.service';
import { LocalStorageKey, ClientDetailsStorageKey } from '../../../../common/enums/enums';
import { ImgsPath, ApiUrl } from '../../../../common/constants/constants';
import { ProfilePage } from '../profile/profile';
import { GetProfilePicReq, GetProfilePicResp } from '../../../../dataModels/get-profile-pic.model';
import { GetProfilePicService } from '../../../../providers/services/common-pages/get-profile-pic.service';
import { CustomFirebaseAnalyticsProvider } from '../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { Utils } from '../../../../common/utils/utils';


export interface PageInterface {
  title: string;
  pageName: string;
  tabComponent?: any;
  index?: number;
  img: string;
  id?: string;
}

@IonicPage()
@Component({
  selector: 'page-menu-navigation',
  templateUrl: 'menu-navigation.html',
})
export class MenuNavigationPage {

  rootPage = 'TabsPage';
  email: string = '';
  headerTitle: string = ImgsPath.britamLogo;
  img: string = '';
  @ViewChild(Nav) nav: Nav;

  pages: PageInterface[] = [
    { id: 'Dashboard', title: 'Dashboard', pageName: 'DashboardPage', img: 'assets/imgs/dashboard.svg', index: 0 },
    { id: 'MyProducts', title: 'My Products', pageName: 'MyProductsPage', tabComponent: 'MyProductsPage', img: 'assets/imgs/product.png', index: 1 },
    { id: 'ServiceHistory', title: 'My Activity', pageName: 'ServiceRequestsListPage', img: 'assets/imgs/Union 2.png' },
    { id: 'PayNow', title: 'Pay Now', pageName: 'MyProductsPage', img: 'assets/imgs/paynow.svg', index: 2 },
    { id: 'BuyOnline', title: 'Buy Now', pageName: 'BuyOnlinePage', tabComponent: 'BuyOnlinePage', img: 'assets/imgs/basket.png' },
    { id: 'FAQ', title: "FAQ'S", pageName: 'FaqPage', img: 'assets/imgs/pros.png' },
    { id: 'Support', title: 'Support', pageName: 'SupportPage', img: 'assets/imgs/support.svg' },
    { id: 'Media', title: 'Document Media', pageName: 'DocumentMediaPage', img: 'assets/imgs/document-media.svg' },
    { id: 'Logout', title: 'Logout', pageName: 'Logout', img: 'assets/imgs/accounts.png' },
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private getProfilePicService: GetProfilePicService,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuNavigationPage');

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('MenuNavigation'); 

    this.email = localStorage.getItem(ClientDetailsStorageKey.Email);
    // this.getProfilePic();
  }

  ionViewWillEnter() {
    this.getProfilePic();
  }

  getProfilePic() {
    let pic = localStorage.getItem(LocalStorageKey.ProfilePic);
    if (!Utils.isEmpty(pic)) {
      this.img = ApiUrl.profileImgUrl + pic;
      return;
    }
    
    var req = new GetProfilePicReq();
    req.idType = localStorage.getItem(LocalStorageKey.NationalIDType);
    req.idValue = localStorage.getItem(LocalStorageKey.NationalID);

    this.getProfilePicService.getProfilePic(req, (resp: GetProfilePicResp) => {
      if (resp.profileUrl) {
        this.img = ApiUrl.profileImgUrl + resp.profileUrl;
        localStorage.setItem(LocalStorageKey.ProfilePic, resp.profileUrl);
      }
    },
    error => {
    });
  }

  openPage(page: PageInterface) {

    // The index is equal to the order of our tabs inside tabs.ts, starting from 0
    var params = { 'pageFlow': page, "isLoggedInUser": true };

    if (page.id == 'Logout') {
      Logout.doLogout();
      this.navCtrl.setRoot(WelcomePage);
      return;
    }

    // The active child nav is our Tabs Navigation
    if (this.nav.getActiveChildNavs().length && page.index != undefined) {
      this.nav.getActiveChildNavs()[0].select(page.index);
    } else {
      // Tabs are not active, so reset the root page 
      // In this case: moving to or from SpecialPage
      this.nav.push(page.pageName, params);
    }
  }

  goToProfile() {
    this.navCtrl.push(ProfilePage);
  }

}
