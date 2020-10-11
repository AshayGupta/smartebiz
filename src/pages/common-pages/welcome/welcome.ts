import { MarketFundsPage } from '../../main-module/buy-product-module/apply-now-funds/market-funds/market-funds';
import { KnowYourCustomerPage } from './../../main-module/buy-product-module/apply-now-funds/know-your-customer/know-your-customer';

import { AboutUsPage } from './../about-us/about-us';
import { FaqPage } from './../faq/faq';
import { LearnHowPage } from './../learn-how/learn-how';
import { Component, ViewChild,Renderer2 } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { LoginPage } from '../../auth-pages/login/login';
import { ContactUsPage } from '../contact-us/contact-us';
import { KnowWhyPage } from '../know-why/know-why';
import { BuyOnlinePage } from '../buy-online/buy-online';
import { BranchLocatorPage } from './../need-help-module/branch-locator/branch-locator';
import { ChatPage } from '../need-help-module/chat/chat';
import { Device } from '@ionic-native/device';
import { SyncVisitorsRequestReq, SyncVisitorsRequestResp } from '../../../dataModels/sync-visitors.model';
import { SyncVisitorsService } from '../../../providers/services/common-pages/sync-visitors.service';
import { LogonService } from '../../../providers/services/auth/logon.service';
import { CustomFirebaseAnalyticsProvider } from '../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../common/decorators/page-track';
import { InAppBrowser } from '@ionic-native/in-app-browser';

declare var Fingerprint2;

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  @ViewChild(Slides) slides: Slides;

  fp:any;
  fpsign:any;
  macAddress:any;
  crmId:any;
  lfrId:any;
  imei:any;

  syncVisitorsRequestReq = new SyncVisitorsRequestReq();

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private device: Device,private renderer: Renderer2,
    public syncVisitorsService:SyncVisitorsService,
    private iab: InAppBrowser,
    public logonService: LogonService,private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('WelcomePage');

  }


  async ngAfterViewInit() {
    this.slides.autoplay = 2000;
    this.slides.effect = 'coverflow'
    this.slides.speed = 3000;
    this.slides.loop = true;
    this.slides.autoplayDisableOnInteraction = false;


    this.addJsToElement('../assets/fingerprint/Fingerprint2.js').onload= () => {
       this.getFingerPrints();
    }

  }


addJsToElement(src: string): HTMLScriptElement {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = src;
  this.renderer.appendChild(document.body, script);
  return script;
}

getFingerPrints () {
  var d1:any = new Date();
 var fp = new Fingerprint2();
 var options = {
   excludeScreenResolution: true,
   excludeAvailableScreenResolution: true,
   userDefinedFonts: false
 };

 fp.get((result, components) => {
   var d2:any = new Date();
   var timeString = "Time took to calculate the fingerprint: " + (d2 - d1) + "ms";
   var details;
   if(typeof window.console !== "undefined") {
       for (var index in components) {
       var obj = components[index];
       var value = obj.value;
       var line = obj.key + " = " + value.toString().substr(0, 100);
        details += line + "<br />";
     }
     this.fp=details;
   }

   this.fpsign=result;
   this.syncVisitors();
 });
}

/// Sync Visitors Code ///

syncVisitors(){

  let syncVisitorsRequest= new SyncVisitorsRequestReq();
      syncVisitorsRequest.fp=this.fp;
      syncVisitorsRequest.fpSign=this.fpsign;
      syncVisitorsRequest.platform=this.device.platform;
      syncVisitorsRequest.uuid=this.device.uuid;
      syncVisitorsRequest.model=this.device.model;
      syncVisitorsRequest.serial=this.device.serial;
      syncVisitorsRequest.version=this.device.version;
      syncVisitorsRequest.isVirtual= this.device.isVirtual;

      console.log('syncVisitorsRequest',syncVisitorsRequest);

    this.syncVisitorsService.syncVisitors(syncVisitorsRequest, (resp: SyncVisitorsRequestResp) => {
        console.log('resp',resp);
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.syncVisitors();
          }
        })
      });
  }

  loginClicked() {
    this.navCtrl.push(LoginPage);
  }

  knowWhyClicked() {
    this.navCtrl.push(KnowWhyPage);
  }

  learnHowClicked() {
    this.navCtrl.push(LearnHowPage);
  }

  buyOnlineClicked() {
    
    this.navCtrl.push(BuyOnlinePage);
  }

  aboutUsClicked() {
    this.navCtrl.push(AboutUsPage);
  }

  contactUsClicked() {
    this.navCtrl.push(ContactUsPage);
  }

  faqClicked() {
    this.navCtrl.push(FaqPage);
  }

  goToChat() {
    this.navCtrl.push(ChatPage)
  }

  goToBranchLocator() {
    this.navCtrl.push(BranchLocatorPage)
  }


}







