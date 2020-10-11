import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServiceHistoryList } from '../../../../dataModels/service-request.model';
import { CustomFirebaseAnalyticsProvider } from '../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../../common/decorators/page-track';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-service-list-detail',
  templateUrl: 'service-list-detail.html',
})
export class ServiceListDetailPage {

  headerTitle: string = 'My Activity';
  serviceList: ServiceHistoryList;

  constructor( 
    public navCtrl: NavController,
    public navParams: NavParams,private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider
  ) {
    this.serviceList = this.navParams.get('listData');
    console.log("ServiceListDetailPage ->", this.serviceList);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceListDetailPage');

      // Firebase Analytics 'screen_view' event tracking
      this.customFirebaseAnalytics.trackView('ServiceListDetailPage');
  }

}
