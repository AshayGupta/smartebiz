import { HtmlContentService } from './../../../providers/services/common-pages/html-content.service';
import { HtmlContentReq, HtmlContentResp } from './../../../dataModels/html-content.model';
import { LocalStorageKey } from './../../../common/enums/enums';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LogonService } from '../../../providers/services/auth/logon.service';
import { CustomFirebaseAnalyticsProvider } from '../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../common/decorators/page-track';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-know-why',
  templateUrl: 'know-why.html',
})
export class KnowWhyPage {

  htmlContent: string = '';
  headerTitle: string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public htmlContentService: HtmlContentService,
    public logonService: LogonService,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider) {
  } 

  ionViewDidLoad() {
    console.log('ionViewDidLoad KnowWhyPage');
    this.setupPage();
    this.getHtml();
    
     // Firebase Analytics 'screen_view' event tracking
     this.customFirebaseAnalytics.trackView('KnowWhy');
  }

  setupPage() {
    let isLoggedIn = JSON.parse(localStorage.getItem(LocalStorageKey.IsLoggedIn));
    isLoggedIn ? this.headerTitle = 'Know Why' : this.headerTitle = 'Know Why';
  }

  getHtml() {
    let htmlReq = new HtmlContentReq();
    htmlReq.contentType = 'Providing Financial Solutions';

    this.htmlContentService.getHtmlFromServer(htmlReq, (resp: HtmlContentResp) => {
      this.htmlContent = resp.content;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getHtml();
          }
        })
      });
  }

}
