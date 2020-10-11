import { Component, Renderer2 } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CustomFirebaseAnalyticsProvider } from '../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../../common/decorators/page-track';

declare var startEmbeddedChat;

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  headerTitle: string = 'Chat';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public renderer: Renderer2,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('Chat'); 
  }

  async ngAfterViewInit() {

    this.addJsToElement('../assets/js/chat.js').onload = () => {
      if (localStorage.getItem("emailId")) {
        new startEmbeddedChat(localStorage.getItem("emailId"), localStorage.getItem("emailId"));
      } else {
        new startEmbeddedChat();
      }
    }
  }

  addJsToElement(src: string): HTMLScriptElement {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    this.renderer.appendChild(document.body, script);
    return script;
  }

}
