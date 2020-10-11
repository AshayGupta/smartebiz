import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocalStorageKey } from '../../../common/enums/enums';
import { ContactUsPage } from './../contact-us/contact-us';
import { ChatPage } from '../need-help-module/chat/chat';
import { BranchLocatorPage } from '../need-help-module/branch-locator/branch-locator';
import { CallNumber } from '@ionic-native/call-number';
import { CustomFirebaseAnalyticsProvider } from '../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../common/decorators/page-track';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-support',
  templateUrl: 'support.html',
})
export class SupportPage {

  headerTitle: string;
  callNum: string = '+254705100100';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private callNumber: CallNumber,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SupportPage');
    this.setupPage();

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('Support'); 
  }

  setupPage() {
    let isLoggedIn = JSON.parse(localStorage.getItem(LocalStorageKey.IsLoggedIn));
    isLoggedIn ? this.headerTitle = 'Support' : this.headerTitle = 'Support';
  }

  goToRequestCallback() {
    this.navCtrl.push(ContactUsPage)
  }

  goToChat() {
    this.navCtrl.push(ChatPage)
  }

  goToBranchLocator() {
    this.navCtrl.push(BranchLocatorPage)
  }

  callClicked() {
    this.callNumber.callNumber(this.callNum, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }

}
