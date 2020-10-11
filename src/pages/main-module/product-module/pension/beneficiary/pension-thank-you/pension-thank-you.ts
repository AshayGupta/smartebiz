import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CustomFirebaseAnalyticsProvider } from '../../../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { ManageCollectionPensionResp } from '../../../../../../dataModels/manageCollection-pension.model';
import { ServiceRequestsListPage } from '../../../../service-request-module/service-requests-list/service-requests-list';


@IonicPage()
@Component({
  selector: 'page-pension-thank-you',
  templateUrl: 'pension-thank-you.html',
})
export class PensionThankYouPage {

  headerTitle: string = 'Thank You ';
  cpPension: ManageCollectionPensionResp;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider
  ) {
    this.cpPension = this.navParams.get('cpPension');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PensionThankYouPage');

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('PensionThankYouPage');
  }

  okClicked() {
    this.navCtrl.push(ServiceRequestsListPage).then(() => {
      this.navCtrl.remove(1, this.navCtrl.getActive().index - 1);
    });
  }

}
