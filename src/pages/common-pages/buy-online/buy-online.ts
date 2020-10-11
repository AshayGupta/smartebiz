import { LogonService } from './../../../providers/services/auth/logon.service';
import { ProductCatalogResp, Products } from './../../../dataModels/product-catalog.model';
import { ProductCatalogService } from './../../../providers/services/common-pages/product-catalog.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiUrl } from '../../../common/constants/constants';
import { WebContentPage } from '../web-content/web-content';
import { LocalStorageKey } from '../../../common/enums/enums';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { CustomFirebaseAnalyticsProvider } from '../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { MarketFundsPage } from '../../main-module/buy-product-module/apply-now-funds/market-funds/market-funds';
import { PageTrack } from '../../../common/decorators/page-track';

@PageTrack("BuyOnlinePage")
@IonicPage()
@Component({
  selector: 'page-buy-online',
  templateUrl: 'buy-online.html',
})
export class BuyOnlinePage {

  headerTitle: string = '';
  productList: Products[] = [];
  defaultImage = 'assets/imgs/boat.png';
  imageURL = ApiUrl.baseUrlBOImg + 'bay/brt/prdV2/';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private logonService: LogonService,
    private productCatalogService: ProductCatalogService,
    private iab: InAppBrowser,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuyOnlinePage');
    this.getProducts();
    this.setupPage();

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('BuyOnline');

  }

  setupPage() {
    let isLoggedIn = JSON.parse(localStorage.getItem(LocalStorageKey.IsLoggedIn));
    isLoggedIn ? this.headerTitle = 'Buy Now' : this.headerTitle = 'Buy Now';
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
  }

  getProducts() {
    this.productCatalogService.getProductCatalog((resp: ProductCatalogResp) => {
      this.productList = resp.productCategory[0].products;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getProducts();
          }
        })
      });
  }

  productDetail(i) {
    if(this.productList[i].productCode == "Money Market Fund") {
      this.navCtrl.push(MarketFundsPage, {'headerTitle': this.productList[i].productTitle})
    }
    else if (this.productList[i].url) {
      this.openInAppBrowser(this.productList[i].url);
    }
    else {
      this.navCtrl.push(WebContentPage, { 'pageFlow': 'BuyNow', 'headerTitle': this.productList[i].productTitle, 'productCode': this.productList[i].productCode })
    }
  }

  openInAppBrowser(url: string) {
    let opts : string = "location=yes,clearcache=yes,hidespinner=no"
    this.iab.create(url, '_system', opts);
  }

}
