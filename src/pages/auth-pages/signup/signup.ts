import { LocalStorageKey, StatusCode, ClientDetailsStorageKey } from './../../../common/enums/enums';
import { LogonService } from './../../../providers/services/auth/logon.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PageName, UserStatus } from '../../../common/enums/enums';
import { AlertService } from '../../../providers/plugin-services/alert.service';
import { SignupService } from '../../../providers/services/auth/signup.service';
import { SignupReq, SignupResp } from '../../../dataModels/signup.model';
import { OtpPage, OtpScreenData } from '../otp/otp';
import { CheckboxValidator } from '../../../common/validators/checkbox.validation';
import { WebContentPage } from '../../common-pages/web-content/web-content';
import { ContactUsPage } from '../../common-pages/contact-us/contact-us';
import { FindCustomerPage } from '../find-customer/find-customer';
import { PageTrack } from '../../../common/decorators/page-track';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  signupForm: FormGroup;
  submitAttempt: boolean;
  pageName: PageName;
  headerTitle: string;
  signupData: SignupReq = new SignupReq();
  idText: string = 'National ID';
  otpData: OtpScreenData = new OtpScreenData();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public alert: AlertService,
    public signupService: SignupService,
    public logonService: LogonService,
  ) {
    this.validateForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
    this.setupPage();
  }

  validateForm() {
    this.signupForm = this.formBuilder.group({
      idOptions: ['', Validators.compose([Validators.required])],
      idValue: ['', Validators.compose([Validators.required])],
      checkAgreement: [false, Validators.compose([CheckboxValidator.isChecked, Validators.required])],
    });
  }

  setupPage() {
    this.pageName = this.navParams.get('pageName');

    if (this.pageName == PageName.Signup) {
      this.headerTitle = 'Sign Up';
    }
    else if (this.pageName == PageName.ForgotPwd) {
      this.headerTitle = 'Forgot Password';
    }

    this.otpData.title = this.headerTitle;
    this.otpData.navigateFromPage = PageName.Signup;
    this.otpData.subTitle = '';

    // Default ID Option select
    this.signupData.idOptionKey = 'nationalId';
  }

  onRadioSelect(value: string) {
    this.idText = value == 'nationalId' ? 'National ID' : 'Passport'
  }

  nextClicked() {
    this.signupService.findCustomer(this.signupData, (resp: SignupResp) => {
      this.getCustomerDetails(resp);
    },
      (err: any) => {
        if (err.status == StatusCode.Status403) {
          this.logonService.getToken((isTokenValid: boolean) => {
            if (isTokenValid) {
              this.nextClicked();
            }
          })
        } else {
          this.contactFormAlert();
        }
      });
  }

  getCustomerDetails(resp: SignupResp) {
    console.log('getCustomerDetails');
    localStorage.setItem(ClientDetailsStorageKey.Email, resp.userDetails.email);
    localStorage.setItem(ClientDetailsStorageKey.PhoneNumber, resp.userDetails.mobile);
    localStorage.setItem(LocalStorageKey.UserStatus, resp.status.toLowerCase());
    
    switch (resp.status.toLowerCase()) {
      case UserStatus.New:
        this.navCtrl.push(FindCustomerPage, { 'userData': resp, 'signupData': this.signupData, 'otpData': this.otpData });
        break;

      case UserStatus.Yes:
        if (this.pageName == PageName.Signup) {
          this.navCtrl.push(FindCustomerPage, { 'userData': resp, 'signupData': this.signupData, 'otpData': this.otpData });
        }
        else if (this.pageName == PageName.ForgotPwd) {
          this.goToOtpPage();
        }
        break;

      case UserStatus.No:
          this.contactFormAlert();
        break;

      default:
        this.contactFormAlert();
        break;
    }
  }

  contactFormAlert() {
    let alertTitle = "";
    let alertMsg = "Your data has not been captured correctly. Kindly fill out the request form and we will contact you in 24 hours.";
    let cancelTxt = "CANCEL";
    let successTxt = "OK";
    
    this.alert.Alert.confirm(alertMsg, alertTitle, cancelTxt, successTxt).then(res => {
      this.navCtrl.push(ContactUsPage);
    }, err => {

    });
  }

  goToOtpPage() {
    this.navCtrl.push(OtpPage, { 'signupData': this.signupData, 'otpData': this.otpData });
  }

  openTnC() {
    this.navCtrl.push(WebContentPage, { 'pageFlow': 'TnC', 'headerTitle': 'Terms and Conditions' })
  }

  openAgreement() {
    this.navCtrl.push(WebContentPage, { 'pageFlow': 'Agreement', 'headerTitle': 'Online Access Agreement' })
  }

  openPrivacyPolicy() {
    this.navCtrl.push(WebContentPage, { 'pageFlow': 'PrivacyPolicy', 'headerTitle': 'Privacy Policy' })
  }

}
