import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { HtmlContentService } from '../../../providers/services/common-pages/html-content.service';
import { HtmlContentReq, HtmlContentResp } from '../../../dataModels/html-content.model';
import { LogonService } from '../../../providers/services/auth/logon.service';
import { LocalStorageKey } from '../../../common/enums/enums';
import { CustomFirebaseAnalyticsProvider } from '../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../common/decorators/page-track';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import * as $ from 'jquery'

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html',
})
export class FaqPage {

  htmlContent: string = '';
  headerTitle: string = '';
  private _link: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public htmlContentService: HtmlContentService,
    public plt: Platform,
    public logonService: LogonService,
    private iab: InAppBrowser,
    private _element: ElementRef,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FaqPage');
    this.setupPage();
    this.getHtml();

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('Faq');

  }


  setupPage() {
    let isLoggedIn = JSON.parse(localStorage.getItem(LocalStorageKey.IsLoggedIn));
    this.headerTitle = isLoggedIn ? 'FAQs' : 'FAQs';
  }

  getHtml() {
    let htmlReq = new HtmlContentReq();
    // htmlReq.contentType = 'faqs';
    htmlReq.contentType = 'Product FAQ';

    this.htmlContentService.getHtmlFromServer(htmlReq, (resp: HtmlContentResp) => {
      this.htmlContent = resp.content;

      $(document).ready(function () {
        $('#FaqLOB_tabs li:first-child').addClass("active");
        $('#lob0').addClass("active");
        $('#product0').addClass("active");
        $('#last-content0').addClass("active");
  
  
        $('#FaqLOB_tabs').on('click', 'a[data-toggle="tab"]', function (e) {
          e.preventDefault();
          var $link = $(this);
          // console.log($link);
          if (!$link.parent().hasClass('active')) {
            // console.log($('.tab-content:not(.' + $link.attr('href').replace('#','') + ') .tab-pane');
            $('.tab-content:not(.' + $link.attr('href').replace('#', '') + ') .tab-pane').removeClass('active');
            $('a[href="' + $link.attr('href') + '_all"][data-toggle="tab"]').click();
            $('.tab-content.' + $link.attr('href').replace('#', '') + ' .tab-pane:first').addClass('active');
          }
  
        });
        $('.panel-collapse').on('show.bs.collapse', function () {
          $(this).siblings('.panel-heading').addClass('active');
        });
  
        $('.panel-collapse').on('hide.bs.collapse', function () {
          $(this).siblings('.panel-heading').removeClass('active');
        });
      })

      // Platform wise condition 
      if (this.plt.is('android')) {
      } else {
        this._enableDynamicHyperlinks();
      }
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getHtml();
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
          // this._launchInAppBrowser(this._link);
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
