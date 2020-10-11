import { LocalStorageKey, StatusCode, ClientDetailsStorageKey } from './../../../common/enums/enums';
import { SetPasswordResp, SetPasswordReq } from './../../../dataModels/setPassword.model';
import { SetPasswordService } from './../../../providers/services/auth/setPassword.service';
import { ThankYouSignupPage } from './../thank-you-signup/thank-you-signup';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PasswordValidator } from '../../../common/validators/password.validator';
import { LogonService } from '../../../providers/services/auth/logon.service';
import { SignupReq } from '../../../dataModels/signup.model';
import { RegexPattern } from '../../../common/constants/constants';
import { AlertService } from './../../../providers/plugin-services/alert.service';
import { PageTrack } from '../../../common/decorators/page-track';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-confirm-password',
  templateUrl: 'confirm-password.html',
})
export class ConfirmPasswordPage {

  passwordForm: FormGroup;
  submitAttempt: boolean = false;
  signupData: SignupReq;
  headerTitle: string;
  pwdTypeForPass: string = 'password';
  pwdTypeforConfirm: string = 'password';
  showConfirmPass: boolean = false;
  email: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public logonService: LogonService,
    public setPasswordService: SetPasswordService,
    public alertService: AlertService
  ) {
    this.validateForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfirmPasswordPage');
    this.setupPage();
  }

  setupPage() {
    this.signupData = this.navParams.get('signupData')
    this.headerTitle = this.navParams.get('headerTitle')

    this.email = localStorage.getItem(ClientDetailsStorageKey.Email);
  }

  validateForm() {
    this.passwordForm = this.formBuilder.group({
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(25), Validators.pattern(RegexPattern.password)])],
      confirmPassword: ['', Validators.compose([Validators.required, PasswordValidator.Match('password', 'confirmPassword')])],
    });
  }

  changePwdType(type: string) {
    if (type == 'forPass') {
      this.pwdTypeForPass = this.pwdTypeForPass == 'password' ? 'text' : 'password';
    }
    if (type == 'forConfirm') {
      this.pwdTypeforConfirm = this.pwdTypeforConfirm == 'password' ? 'text' : 'password';
    }
  }

  onPasswordChange() {
    if (((this.submitAttempt || this.passwordForm.controls.password.touched) && this.passwordForm.controls.password.errors)) {
      this.showConfirmPass = false;
    }
    else {
      this.showConfirmPass = true;
    }
  }

  clickSave() {
    let passReq = new SetPasswordReq();
    passReq.idOptionKey = this.signupData.idOptionKey;
    passReq.idValue = this.signupData.idValue;
    passReq.password = this.passwordForm.controls.password.value;

    this.setPasswordService.setPassword(passReq, (resp: SetPasswordResp) => {
      this.navCtrl.push(ThankYouSignupPage, { 'password': passReq.password, 'headerTitle': this.headerTitle })
    },
      (error) => {
        if (error.status == StatusCode.Status403) {
          this.logonService.getToken((isTokenValid: boolean) => {
            if (isTokenValid) {
              this.clickSave();
            }
          })
        }
        else {
          this.alertService.Alert.alert(error.error.message, '', 'OK');
        }
        
      });
  }

}
