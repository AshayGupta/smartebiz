import { ApiUrl } from './../../../../../common/constants/constants';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HtmlContentReq, HtmlContentResp } from './../../../../../dataModels/html-content.model';
import { HtmlContentService } from './../../../../../providers/services/common-pages/html-content.service';
import { OnboardingTncModalPage } from './../onboarding-tnc-modal/onboarding-tnc-modal';
import { BuyProductReq } from './../../../../../dataModels/buy-product-model';
import { FormBuilder } from '@angular/forms';
import { LogonService } from './../../../../../providers/services/auth/logon.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Modal, ModalController } from 'ionic-angular';
import { FundsPaymentMethodPage } from '../funds-payment-method/funds-payment-method';
import { LocalStorageKey, MongoAMCStaging } from '../../../../../common/enums/enums';
import { AmcMongoStagesService } from '../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';
import { AmcMongoStagesReq, TermAndCondition } from '../../../../../dataModels/amc-mongo-stages.model';
import { AlertService } from '../../../../../providers/plugin-services/alert.service';


@IonicPage()
@Component({
  selector: 'page-verify-funds',
  templateUrl: 'verify-funds.html',
})
export class VerifyFundsPage {

  submitAttempt: boolean = false;
  headerTitle: string = 'Review';
  buyProductReq: BuyProductReq;
  tnc = new TermAndCondition();
  onboardingMongoReq = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public logonService: LogonService,
    public modalCtrl: ModalController,
    public htmlContentService: HtmlContentService,
    private iab: InAppBrowser,
    private alertService: AlertService,
    private amcMongoStagesService: AmcMongoStagesService
  ) {
    this.buyProductReq = this.navParams.get('buyProductReq');
    this.onboardingMongoReq = this.navParams.get('amcMongoReq');
    console.log('VerifyFundsPage buyProductReq ->', this.buyProductReq);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerifyFundsPage');
    this.openTnC();
    this.tnc.checked = false;
  }

  tncCheckboxClicked(event) {
    console.log("tncCheckboxClicked -> ", event);
  }
  
  openTnC() {
    let htmlReq = new HtmlContentReq();
    htmlReq.contentType = 'amc onboarding';

    this.htmlContentService.getHtmlFromServer(htmlReq, (resp: HtmlContentResp) => {
      this.tnc.termAndCondition = resp.content;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.openTnC();
          }
        })
      });
  }

  openTncModal() {
    if(this.tnc.termAndCondition==undefined){
      this.tnc.termAndCondition="terms and conditions not found."
    }
    let options = {
      showBackdrop: true,
      enableBackdropDismiss: true,
    };
    let tncModal: Modal = this.modalCtrl.create(OnboardingTncModalPage, { 'tnc': this.tnc.termAndCondition, 'nav': this.navCtrl }, options);
    tncModal.present();
  }

  OpenInBrowser(){
    if(this.buyProductReq.bankDetail.documents.length > 0){
      let opts : string = "location=yes,clearcache=no,hidespinner=no"
      console.log('OpenInBrowser -> ', ApiUrl.profileImgUrl+this.buyProductReq.bankDetail.documents[0].url);
      try {
        this.iab.create(ApiUrl.profileImgUrl + this.buyProductReq.bankDetail.documents[0].url, '_system', opts);
      }
      catch {
        let title = "Server Temporary Unavailable"
        this.alertService.Alert.alert('', title, "OK")
      }
    }
  }

  proceedClicked() {
    console.log('buyProductReq ->', this.buyProductReq);
    if (!this.tnc.checked) return;

    this.setStagesInMongo(MongoAMCStaging.Done);

    this.buyProductReq.tnc = this.tnc;
    localStorage.setItem(LocalStorageKey.PageFlow, 'AmcOnboarding')

    let options = {
      showBackdrop: true,
      enableBackdropDismiss: true,
    };
    let paynowModal: Modal = this.modalCtrl.create(FundsPaymentMethodPage, { 'buyProductReq': this.buyProductReq, 'nav': this.navCtrl, 'amcMongoReq': this.onboardingMongoReq }, options);
    paynowModal.present();
  }

  setStagesInMongo(status: string) {
    this.onboardingMongoReq["stages"].filter(item => {
      if (item.name == "review") {
        item.status = status;
      }
    });
    this.onboardingMongoReq["termAndCondition"] = this.tnc;

    this.amcMongoStagesService.updateAmcMongoStage(this.onboardingMongoReq, (resp) => {
    })
  }

}
