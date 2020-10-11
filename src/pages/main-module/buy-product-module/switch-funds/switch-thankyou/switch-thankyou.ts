import { ServiceRequestsListPage } from './../../../service-request-module/service-requests-list/service-requests-list';
import { Switch } from './../../../../../dataModels/switch.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SwitchThankyouPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-switch-thankyou',
  templateUrl: 'switch-thankyou.html',
})
export class SwitchThankyouPage {

  headerTitle: string = "Thank You";
  switchReq: Switch = new Switch();
  transactionDate: Date;
  srNumber: string;
  totalAmount: string;
  arrayList:Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SwitchThankyouPage');
    this.switchReq = this.navParams.get('switchReq');
    this.transactionDate = this.navParams.get("transactionDate");
    this.srNumber = this.navParams.get("srNumber");
    this.calculateTotal();
  }

  okClicked() {
    this.navCtrl.push(ServiceRequestsListPage).then(() => {
      this.navCtrl.remove(1, this.navCtrl.getActive().index - 1);
    });
  }

  calculateTotal() {
    let total = 0.00;
    this.arrayList=[];
    this.switchReq.switchOrder.forEach(item => {
      item.transferTo.forEach(data => {
        let obj={
          fundFrom:item.transferFrom.fundName,
          fundTo:data.targetFundName,
          amount:data.amount
        }
        this.arrayList.push(obj);
        total += parseFloat(data.amount);
      })
    })
    console.log(this.arrayList)
    this.totalAmount = total.toFixed(2).toString();
  }
}
