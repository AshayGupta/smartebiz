import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AmcMongoStagesReq } from '../../../../../../dataModels/amc-mongo-stages.model';
import { CustomFirebaseAnalyticsProvider } from '../../../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { ServiceRequestsListPage } from '../../../../service-request-module/service-requests-list/service-requests-list';

@IonicPage()
@Component({
  selector: 'page-initial-withdraw-thankyou',
  templateUrl: 'initial-withdraw-thankyou.html',
})
export class InitialWithdrawThankyouPage {
  headerTitle: string = 'Thank You ';
  pensionMongoReq: AmcMongoStagesReq;
  transactionDate: Date = new Date();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider
  ) {
    this.pensionMongoReq = this.navParams.get('pensionMongoReq');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad InitialWithdrawThankyouPage');
    this.customFirebaseAnalytics.trackView('PensionThankYouPage');

  }
  
  okClicked() {
    this.navCtrl.push(ServiceRequestsListPage).then(() => {
      this.navCtrl.remove(1, this.navCtrl.getActive().index - 1);
    });
  }

}
