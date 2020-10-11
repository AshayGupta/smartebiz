import { ServiceRequestsListPage } from './../../../service-request-module/service-requests-list/service-requests-list';
import { TopUpReq } from './../../../../../dataModels/top-up.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-withdraw-thankyou',
  templateUrl: 'withdraw-thankyou.html',
})
export class WithdrawThankyouPage {

  headerTitle: string = 'Thank You ';
  withdrawReq: TopUpReq = new TopUpReq();
  srNumber: string;
  transactionDate:Date;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WithdrawThankyouPage');
    this.withdrawReq = this.navParams.get('withdrawReq');
    this.srNumber=this.navParams.get('srNumber');
    this.transactionDate=this.navParams.get('transactionDate');
  }

  okClicked(){
    this.navCtrl.push(ServiceRequestsListPage).then(() => {
      this.navCtrl.remove(1, this.navCtrl.getActive().index - 1);
    });  }
}

