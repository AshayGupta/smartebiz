import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CustomFirebaseAnalyticsProvider } from '../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../common/decorators/page-track';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-thank-you',
  templateUrl: 'thank-you.html',
})
export class ThankYouPage {

  headerTitle: string = 'Thank you';
  result: string;
  pageFlow: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, 
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider
  ) {
    this.result = this.navParams.get('result');
    this.pageFlow = this.navParams.get('pageFlow');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ThankYouPage');

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('ThankYou');
  }
}
