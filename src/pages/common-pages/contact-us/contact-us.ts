import { AlertService } from './../../../providers/plugin-services/alert.service';
import { ContactUsResp } from './../../../dataModels/contact-us.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactUsService } from '../../../providers/services/common-pages/contact-us.service';
import { RegexPattern, ImgsPath } from '../../../common/constants/constants';
import { ContactUsReq } from '../../../dataModels/contact-us.model';
import { LogonService } from '../../../providers/services/auth/logon.service';
import { LocalStorageKey } from '../../../common/enums/enums';
import { CountryCodeService } from '../../../providers/services/common-pages/country-code.service';
import { CountryCodeResp, CountryCode } from '../../../dataModels/country-code.model';
import { CustomFirebaseAnalyticsProvider } from '../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../common/decorators/page-track';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUsPage {

  contactUsForm: FormGroup;
  submitAttempt: boolean = false;
  headerImg: string;
  countryCode: CountryCode[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public contactUsService: ContactUsService,
    public logonService: LogonService,
    public countryCodeService: CountryCodeService,
    public alertService: AlertService,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider

  ) {
    this.validateForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactUsPage');
    this.setupPage();
    this.getCountryCodes();

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('ContactUs');
  }

  setupPage() {
    let isLoggedIn = JSON.parse(localStorage.getItem(LocalStorageKey.IsLoggedIn));
    isLoggedIn ? this.headerImg = ImgsPath.britamLogo : this.headerImg = ImgsPath.britamLogo;
  }

  validateForm() {
    this.contactUsForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.pattern(RegexPattern.onlyContainLetters)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(RegexPattern.email)])],
      countryCode: ['', Validators.compose([Validators.required])],
      phone: ['', Validators.compose([Validators.required, Validators.pattern(RegexPattern.numStartWithZero), Validators.pattern(RegexPattern.onlyContainNumbers), Validators.minLength(10), Validators.maxLength(10)])],
      comment: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(500)])]
    });
  }


  getCountryCodes() {
    this.countryCodeService.countryCodes((resp: CountryCodeResp) => {
      this.countryCode = resp.countryCodes;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getCountryCodes();
          }
        })
      });
  }


  submitClicked() {
    let submitData = new ContactUsReq();
    submitData.name = this.contactUsForm.controls.name.value;
    submitData.email = this.contactUsForm.controls.email.value;
    submitData.phone = this.contactUsForm.controls.phone.value;
    submitData.comment = this.contactUsForm.controls.comment.value;
    submitData.callBack = this.callme;
    submitData.countryCode = this.contactUsForm.controls.countryCode.value;

    this.contactUsService.submitContactUs(submitData, (resp: ContactUsResp) => {
      console.log('done');
      this.alertService.Alert.alert(resp.successMessage).then(() => {
        this.navCtrl.pop();
      })


      // this.contactUsForm.reset(); 
      // this.callme=false;
      // this.navCtrl.push(ThanksPage,{"name":this.name}); 

    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.submitClicked();
          }
        })
      });
  }

  callme: any = false;

  callmeback(e: any) {

    //  console.log('callmeback check',e.checked); 
    if (e.checked == true) {
      //  console.log('call me back true'); 
      this.callme = true;

    }
  }
}
