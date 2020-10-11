import { AlertService } from './../../../providers/plugin-services/alert.service';
import { LocalStorageKey, PageName, StatusCode } from './../../../common/enums/enums';
import { LogonService } from './../../../providers/services/auth/logon.service';
import { LoginService } from './../../../providers/services/auth/login.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegexPattern, ImgsPath } from '../../../common/constants/constants';
import { LoginReq, LoginResp } from '../../../dataModels/login.model';
import { SignupPage } from '../signup/signup';
import { MenuNavigationPage } from './../../main-module/dashboard-module/menu-navigation/menu-navigation';
import { WebContentPage } from '../../common-pages/web-content/web-content';
import { PageTrack } from '../../../common/decorators/page-track';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm: FormGroup;
  submitAttempt: boolean = false;
  pwdType: string = 'password';
  loginData = new LoginReq();
  headerImg: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public loginService: LoginService,
    public logonService: LogonService,
    private alertService: AlertService
  ) {
    this.validateForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.setupPage();
  }

  setupPage() {
    let isLoggedIn = JSON.parse(localStorage.getItem(LocalStorageKey.IsLoggedIn));
    isLoggedIn ? this.headerImg = ImgsPath.britamLogo : this.headerImg = ImgsPath.britamLogo;
  }

  validateForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(RegexPattern.email)])],
      password: ['', Validators.compose([Validators.required])],
    });
  }

  changePwdType() {
    this.pwdType == 'password' ? this.pwdType = 'text' : this.pwdType = 'password';
  }

  loginClicked() {
    this.loginService.doLogin(this.loginData, (resp: LoginResp) => {
      localStorage.setItem(LocalStorageKey.NationalID, resp.nationalID);
      localStorage.setItem(LocalStorageKey.NationalIDType, resp.nationalIDType);
      localStorage.setItem(LocalStorageKey.IsLoggedIn, JSON.stringify(true));
      
      this.goToDashboard();
    },
      (err) => {
        if (err.status == StatusCode.Status403) {
          this.logonService.getToken((isTokenValid: boolean) => {
            if (isTokenValid) {
              this.loginClicked();
            }
          })
        }
        else {
          this.alertService.Alert.alert(err.error.message)
        }
      });
  }

  signUpClicked() {
    this.navCtrl.push(SignupPage, { 'pageName': PageName.Signup });
  }

  forgotPwdClicked() {
    this.navCtrl.push(SignupPage, { 'pageName': PageName.ForgotPwd });
  }

  goToDashboard() {
    this.navCtrl.setRoot(MenuNavigationPage);
  }

  openTnC() {
    this.navCtrl.push(WebContentPage, {'pageFlow': 'TnC', 'headerTitle': 'Terms and Conditions'})
  } 

  openPrivacyPolicy() {
    this.navCtrl.push(WebContentPage, {'pageFlow': 'PrivacyPolicy', 'headerTitle': 'Privacy Policy'})
  }
  

}
