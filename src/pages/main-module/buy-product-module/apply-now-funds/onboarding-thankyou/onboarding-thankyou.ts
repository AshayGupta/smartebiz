import { LocalStorageKey } from './../../../../../common/enums/enums';
import { ServiceRequestsListPage } from './../../../service-request-module/service-requests-list/service-requests-list';
import { MakePaymentReq, MakePaymentResp } from './../../../../../dataModels/make-payment.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-onboarding-thankyou',
  templateUrl: 'onboarding-thankyou.html',
})
export class OnboardingThankyouPage {

  headerTitle: string = "Thank You";
  paymentReq: MakePaymentReq = new MakePaymentReq();
  transactionDate: Date = new Date();
  paymentResp:MakePaymentResp=new MakePaymentResp();

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OnboardingThankyouPage');
    this.paymentReq=this.navParams.get('paymentReq');
    this.paymentResp=this.navParams.get('paymentResp');
    console.log('OnboardingThankyouPage paymentReq',this.paymentReq);
  }

  okClicked() {
    if(localStorage.getItem(LocalStorageKey.IsLoggedIn) == "true"){
      this.navCtrl.push(ServiceRequestsListPage).then(() => {
        this.navCtrl.remove(1, this.navCtrl.getActive().index - 1);
      });
    }
    else{
      this.navCtrl.popToRoot();
    }
  }

}
