import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { HtmlContentService } from '../../../providers/services/common-pages/html-content.service';
import { LogonService } from '../../../providers/services/auth/logon.service';
import { HtmlContentReq, HtmlContentResp } from '../../../dataModels/html-content.model';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { CustomFirebaseAnalyticsProvider } from '../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../common/decorators/page-track';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-web-content',
  templateUrl: 'web-content.html',
})
export class WebContentPage {

  pageFlow: string = '';
  headerTitle: string;
  productCode: string;
  htmlContent: string = '';
  private _link: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public htmlContentService: HtmlContentService,
    public logonService: LogonService,
    public plt: Platform,
    private iab: InAppBrowser, private _element: ElementRef,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider
  ) {
    this.pageFlow = this.navParams.get('pageFlow');
    this.headerTitle = this.navParams.get('headerTitle');
    this.productCode = this.navParams.get('productCode');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WebContentPage');
    this.setupPage();

    this.customFirebaseAnalytics.trackView('WebContent');

  }

  setupPage() {
    switch (this.pageFlow) {
      case 'TnC':
        this.getHtml('Term and condition');
        break;
      case 'PrivacyPolicy':
        this.getHtml('Privacy policy')
        break;
      case 'Agreement':
        this.getHtml('Signup Agreement and Acceptance');
        break;
      case 'BuyNow':
        this.getHtml(this.productCode);
        break;
      default:
        break;
    }
  }

  getHtml(contentType: string) {
    let htmlReq = new HtmlContentReq();
    htmlReq.contentType = contentType;

    this.htmlContentService.getHtmlFromServer(htmlReq, (resp: HtmlContentResp) => {
      this.htmlContent = resp.content;

      if (this.plt.is('android')) {
      } else {
        this._enableDynamicHyperlinks();
      }

    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getHtml(contentType);
          }
        })
      });
  }



  public ngOnInit(): void {
    this._enableDynamicHyperlinks();
  }




  /**
   * Enable hyperlinks that are embedded within a HTML string
   * @private
   * @method _enableDynamicHyperlinks
   * @return {none}
   */
  private _enableDynamicHyperlinks(): void {
    // Provide a minor delay to allow the HTML to be rendered and 'found'
    // within the view template
    setTimeout(() => {
      // Query the DOM to find ALL occurrences of the <a> hyperlink tag
      const urls: any = this._element.nativeElement.querySelectorAll('a');

      // Iterate through these
      urls.forEach((url) => {
        // Listen for a click event on each hyperlink found
        url.addEventListener('click', (event) => {
          // Retrieve the href value from the selected hyperlink
          event.preventDefault();
          this._link = event.target.href;

          // Log values to the console and open the link within the InAppBrowser plugin
          console.log('Name is: ' + event.target.innerText);
          console.log('Link is: ' + this._link);
          this._launchInAppBrowser(this._link);
        }, false);
      });
    }, 2000);
  }



  /**
   * Creates/launches an Ionic Native InAppBrowser window to display hyperlink locations within
   * @private
   * @method _launchInAppBrowser
   * @param {string}    link           The URL to visit within the InAppBrowser window
   * @return {none}
   */
  private _launchInAppBrowser(link: string): void {
    let opts: string = "location=yes,clearcache=yes,hidespinner=no"
    this.iab.create(link, '_blank', opts);
  }


}
