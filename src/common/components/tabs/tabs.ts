import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyProductsPage } from '../../../pages/main-module/product-module/my-products/my-products';
import { PageInterface } from '../../../pages/main-module/dashboard-module/menu-navigation/menu-navigation';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root: any = 'DashboardPage';
  tab2Root: any = 'MyProductsPage';
  tab3Root: any = 'MyProductsPage';
  myIndex: number;

  pages: PageInterface[] = [
    { id: 'PayNow', title: 'Pay Now', pageName: 'MyProductsPage', img: 'assets/imgs/accounts.png' },
  ];
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.myIndex = navParams.data.tabIndex || 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

  payNow(){
    console.log("payNow");
    let params = { 'pageFlow': this.pages[0] };

    this.navCtrl.push(MyProductsPage, params);
  }

}
