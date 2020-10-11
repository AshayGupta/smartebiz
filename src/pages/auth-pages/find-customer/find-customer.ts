import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SignupResp, SignupReq } from '../../../dataModels/signup.model';
import { UserStatus } from '../../../common/enums/enums';
import { LoginPage } from './../login/login';
import { OtpPage, OtpScreenData } from '../otp/otp';
import { PageTrack } from '../../../common/decorators/page-track';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-find-customer',
  templateUrl: 'find-customer.html',
})
export class FindCustomerPage {

  userData: SignupResp;
  signupData: SignupReq;
  otpData: OtpScreenData;
  pageDetail = [
    { title: "Existing Customer", imagePath: "assets/imgs/tick-icon.png", content: "You already have an account with us. Please login with this Email Id.", buttonText: "Login" },
    { title: "New Customer", imagePath: "assets/imgs/tick-icon.png", content: "You are a New Customer, Click 'Send OTP' to reset your password", buttonText: "Send OTP" },
    { title: "Customer Not Found", imagePath: "assets/imgs/Group79.png", content: "You are not a Britam Customer, please contact Britam customer care at +254-76786786 Click.", buttonText: "Home" }
  ];
  index: number;
  emailAddress: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {
    this.userData = this.navParams.get('userData');
    this.signupData = this.navParams.get('signupData');
    this.otpData = this.navParams.get('otpData');

    this.setupPage();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FindCustomerPage');
  }

  setupPage() {
    this.emailAddress = this.userData.userDetails.email;

    switch (this.userData.status.toLocaleLowerCase()) {
      case UserStatus.New:
        this.index = 1;

        break;
      case UserStatus.Yes:
        this.index = 0;

        break;
      case UserStatus.No:
        this.index = 2;

        break;
      default:
        console.log('User not found');
        break;
    }
  }

  submit(index: number) {
    if (index == 0) {
      this.navCtrl.push(LoginPage);
    }
    else if (index == 1) {
      this.navCtrl.push(OtpPage, { 'signupData': this.signupData, 'otpData': this.otpData });
    }
  }

}
