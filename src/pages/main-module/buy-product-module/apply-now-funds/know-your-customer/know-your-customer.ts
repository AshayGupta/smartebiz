import { LogonService } from '../../../../../providers/services/auth/logon.service';
import { ClientDetailsService } from '../../../../../providers/services/main-module-services/product-services/client-details.service';
import { ClientDetailsResp, ClientDetailsReq } from '../../../../../dataModels/client-details.model';
import { BuyProductReq } from '../../../../../dataModels/buy-product-model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertOptions } from 'ionic-angular';
import { PersonalDetail } from '../../../../../dataModels/buy-product-model';
import { ContactResp, ContactDetail, ContactReq } from '../../../../../dataModels/get-contact.model';
import { RegexPattern } from '../../../../../common/constants/constants';
import { AlertService } from '../../../../../providers/plugin-services/alert.service';
import { ContactUsPage } from '../../../../common-pages/contact-us/contact-us';
import { ActionsheetService } from '../../../../../providers/plugin-services/actionsheet.service';
import { OtpScreenData, OtpPage } from '../../../../auth-pages/otp/otp';
import { PageName, LocalStorageKey, Lob } from '../../../../../common/enums/enums';
import { SignupReq } from '../../../../../dataModels/signup.model';
import { AlertInterface } from '../../../../../common/interfaces/alert.interface';
import { GetContactService } from '../../../../../providers/services/main-module-services/buy-product-module-services/get-contacts.service';
import { UserDetails } from '../../../../../dataModels/user-details.model';
import { LoginPage } from '../../../../auth-pages/login/login';


@IonicPage()
@Component({
  selector: 'page-know-your-customer',
  templateUrl: 'know-your-customer.html',
})
export class KnowYourCustomerPage {

  headerTitle: string;
  kycForm: FormGroup;
  submitAttempt: boolean = false;
  buyProductReq: BuyProductReq;
  userDetails: UserDetails = new UserDetails();
  withLob: boolean;
  withoutLob: boolean;
  otpData = new OtpScreenData();
  selectOptions: AlertOptions;
  disableFields: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public clientDetailsService: ClientDetailsService,
    public getContactService: GetContactService,
    public logonService: LogonService,
    public alert: AlertService,
    public actionsheetService: ActionsheetService
  ) {
    this.buyProductReq = this.navParams.get('buyProductReq');

    console.log('KnowYourCustomerPage buyProductReq ->', this.buyProductReq);

    this.validateForm();
  }

  validateForm() {
    this.kycForm = this.formBuilder.group({
      idOptionKey: ['', Validators.compose([Validators.required])],
      idValue: ['', Validators.compose([Validators.required])],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KnowYourCustomerPage');
    this.otpData.navigateFromPage = PageName.KnowYourCustomerPage;
    this.otpData.title = 'Verify OTP';

    if (localStorage.getItem(LocalStorageKey.IsLoggedIn) == "true") {
      this.userDetails.idType = 'nationalId';
      this.userDetails.idValue = localStorage.getItem(LocalStorageKey.NationalID);
      this.disableFields = true;
    }
    this.headerTitle = this.buyProductReq.investment.selectedFund.productName;

    this.buyProductReq.isNewUser = false;
  }

  proceedClicked() {
    this.buyProductReq.userDetails = this.userDetails;
    this.getClientDetailsWithoutLob();
  }

  getClientDetailsWithoutLob() {
    let reqData = new ClientDetailsReq();
    reqData.nationalIdNumber = this.userDetails.idValue;//'23629881';
    reqData.lobSrc = '';

    this.clientDetailsService.getClientDetails(reqData, (resp: ClientDetailsResp) => {
      if (!resp.data) {
        this.withoutLob = false;
      }
      else {
        this.withoutLob = true;

        let personalDetail = new PersonalDetail();
        personalDetail.firstName = resp.firstName;
        personalDetail.middleName = resp.middleName;
        personalDetail.lastName = resp.surname;
        personalDetail.gender = resp.gender;
        if(resp.dateOfBirth){
          let date = new Date(resp.dateOfBirth);
          let myDate= new Date(date.getTime() - date.getTimezoneOffset()*60000).toISOString();
          personalDetail.dob = myDate;
        }else{
          personalDetail.dob=resp.dateOfBirth;
        }
        personalDetail.kraPin = resp.pinNumber;
        personalDetail.nationality = resp.nationality;
        if (resp.addresses.length > 0) {
          personalDetail.physicalAddress = resp.addresses[0].postalAddress + ' ' + resp.addresses[0].city + ' ' + resp.addresses[0].country + ' ' + resp.addresses[0].postalCode;
        }else{
          personalDetail.physicalAddress="";
        }

        if (resp.contacts.length > 0) {
          resp.contacts.filter(item => {
            // if (item.contactType.toLowerCase() == 'm') {
            personalDetail.mobile = item.mobile;
            // }
            // if (item.contactType.toLowerCase() == 'e') {
            personalDetail.email = item.email;
            // }
          });
        }
        else {
          personalDetail.mobile = "";
          personalDetail.email = "";
        }

        this.buyProductReq.personalDetail = personalDetail;
      }

      if (localStorage.getItem(LocalStorageKey.IsLoggedIn) == "true") {
        this.getContactsList();
      }
      else {
        this.getClientDetailsWithLob();
      }

    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getClientDetailsWithoutLob();
          }
        })
      });
  }

  getClientDetailsWithLob() {
    let reqData = new ClientDetailsReq();
    reqData.nationalIdNumber = this.userDetails.idValue;//'8951392';
    reqData.lobSrc = Lob.AMC;

    this.clientDetailsService.getClientDetails(reqData, (resp: ClientDetailsResp) => {
      this.withLob = !resp.data ? false : true;
      console.log("WithLob ->", this.withLob, "withoutLob ->", this.withoutLob);

      if (!this.withoutLob && this.withLob) {  // false, true
        this.requestCallBack();
      }
      else if (this.withoutLob && this.withLob) {
        this.askForTopup();
      }
      else if (this.withoutLob && !this.withLob) {
        this.getContactsList();
      }
      else {
        this.buyProductReq.isNewUser = true;
        this.newUser();
      }
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getClientDetailsWithLob();
          }
        })
      });
  }

  requestCallBack() {
    let alertTitle = "";
    let alertMsg = "Kindly fill out the request form and we will contact you in 24 hours.";
    let cancelTxt = "CANCEL";
    let successTxt = "OK";
    this.alert.Alert.confirm(alertMsg, alertTitle, cancelTxt, successTxt).then(res => {
      this.navCtrl.push(ContactUsPage);
    }, err => {

    });
  }

  askForTopup() {
    let alertTitle = "Welcome Back!";
    let alertMsg = "It's look like that you already have an account with us, do you really want to create a NEW ACCOUNT ?";
    let cancelTxt = "TOP UP";
    let successTxt = "PROCEED";
    this.alert.Alert.confirm(alertMsg, alertTitle, cancelTxt, successTxt).then(res => {
      this.getContactsList();
    }, err => {
      this.gotoTopupScreen()
    });
  }

  newUser() {
    let alertTitle = "You are a new Customer to Britam !!";
    let alertMsg = "Would you like to Proceed ?";
    let cancelTxt = "CANCEL";
    let successTxt = "PROCEED";
    this.alert.Alert.confirm(alertMsg, alertTitle, cancelTxt, successTxt).then(res => {
      this.enterMobile();
    }, err => {

    });
  }

  enterMobile() {
    let alertData: AlertInterface = {
      title: "Enter Contact",
      message: "Dear Customer, please verify your mobile number",
      cancelText: "CANCEL",
      successText: "OK",
      type: "number",
      placeholder: "Enter Contact Number",
      value: "0"
    };

    this.alert.Alert.prompt(alertData).then((res: string) => {
      console.log(res);
      this.otpData.mobile = res;
      // this.buyProductReq.personalDetail.mobile=res;
      this.gotoOtpScreen();
    }, err => {

    });
  }

  getContactsList() {
    let reqData = new ContactReq();
    reqData.nationalIdNumber = this.buyProductReq.userDetails.idValue;//'8951392';

    this.getContactService.getContacts(reqData, (resp: ContactResp) => {
      this.contactsActionSheet(resp.contacts)
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getContactsList();
          }
        })
      });
  }

  contactsActionSheet(contacts: ContactDetail[]) {
    let title = "Select Contact";

    this.actionsheetService.ActionSheet.simpleListSheet(title, contacts).then((resp: number) => {
      console.log(resp);
      this.otpData.mobile = contacts[resp].mobileNumber;
      this.gotoOtpScreen();
    })
  }

  gotoTopupScreen() {
    this.navCtrl.push(LoginPage);
  }

  gotoOtpScreen() {
    let signupReq = new SignupReq();
    signupReq.idOptionKey = this.userDetails.idType;
    signupReq.idValue = this.userDetails.idValue;

    this.navCtrl.push(OtpPage, { 'signupData': signupReq, 'buyProductReq': this.buyProductReq, 'otpData': this.otpData });
  }

}
