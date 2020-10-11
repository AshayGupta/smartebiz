import { AlertService } from './../../../../../providers/plugin-services/alert.service';
import { IprsService } from './../../../../../providers/services/main-module-services/buy-product-module-services/iprs-check.service';
import { IprsReq, IprsResp } from './../../../../../dataModels/iprs-check.model';
import { RegexPattern } from './../../../../../common/constants/constants';
import { Validators } from '@angular/forms';
import { BuyProductReq, PersonalDetail } from './../../../../../dataModels/buy-product-model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LogonService } from './../../../../../providers/services/auth/logon.service';
import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavParams, NavController } from 'ionic-angular';
import { BankDetailsPage } from '../bank-details/bank-details';
import { AlertInterface } from '../../../../../common/interfaces/alert.interface';
import { CountryCodeService } from '../../../../../providers/services/common-pages/country-code.service';
import { CountryCodeResp, CountryCode } from '../../../../../dataModels/country-code.model';
import { AmcMongoStagesReq, AmcOnboarding, Stages } from '../../../../../dataModels/amc-mongo-stages.model';
import { SourceTag, MongoAMCStaging, MongoSourceTag, ChannelTag } from '../../../../../common/enums/enums';
import { AmcMongoStagesService } from '../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';
import { Utils } from '../../../../../common/utils/utils';

@IonicPage()
@Component({
  selector: 'page-personal-details',
  templateUrl: 'personal-details.html'
})
export class PersonalDetailsPage {

  personalDetailForm: FormGroup;
  submitAttempt: boolean = false;
  headerTitle: string = 'Personal Details';
  buyProductReq: BuyProductReq;
  personalDetail: PersonalDetail = new PersonalDetail();
  countryCodes: CountryCode[] = [];
  iprsResp: IprsResp;
  onboardingMongoReq = {};
  mongoStages: Stages[] = [{
    name: "personalVerification",
    status: MongoAMCStaging.Pending
  },
  {
    name: "otpVerification",
    status: MongoAMCStaging.Pending
  },
  {
    name: "personalDetails",
    status: MongoAMCStaging.Pending
  },
  {
    name: "iprsVerification",
    status: MongoAMCStaging.Pending
  },
  {
    name: "addBankDetails",
    status: MongoAMCStaging.Pending
  },
  {
    name: "investmentFund",
    status: MongoAMCStaging.Pending
  },
  {
    name: "review",
    status: MongoAMCStaging.Pending
  },
  {
    name: "payment",
    status: MongoAMCStaging.Pending
  }
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public logonService: LogonService,
    public iprsService: IprsService,
    public alert: AlertService,
    public countryCodeService: CountryCodeService,
    private amcMongoStagesService: AmcMongoStagesService
  ) {
    this.buyProductReq = this.navParams.get("buyProductReq");
    console.log('PersonalDetailsPage buyProductReq ->', this.buyProductReq);
    this.validateForm();
  }

  validateForm() {
    this.personalDetailForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.required, Validators.pattern(RegexPattern.onlyContainLetters)])],
      middleName: ['', Validators.compose([Validators.pattern(RegexPattern.onlyContainLetters)])],
      lastName: ['', Validators.compose([Validators.required, Validators.pattern(RegexPattern.onlyContainLetters)])],
      gender: ['', Validators.compose([Validators.required])],
      dob: ['', Validators.compose([Validators.required])],
      kraPin: ['', Validators.compose([Validators.required])],
      nationality: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(RegexPattern.email)])],
      mobile: ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      physicalAddress: ['', Validators.compose([Validators.required])],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PersonalDetailsPage');

    if (!this.buyProductReq.isNewUser) {
      this.personalDetail = this.buyProductReq.personalDetail;
      if (this.personalDetail.nationality == "Kenyan") {
        this.personalDetail.nationality = "Kenya"
      }
      this.personalDetail.iprsVerified = '1';
    }
    else {
      this.personalDetail.mobile = this.buyProductReq.otpVerification[0].mobileNumber;
    }
    this.getCountryCodes();
  }

  getCountryCodes() {
    this.countryCodeService.countryCodes((resp: CountryCodeResp) => {
      this.countryCodes = resp.countryCodes;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getCountryCodes();
          }
        })
      });
  }

  selectNationality(name: string) {
    this.countryCodes.filter(item => {
      if (item.countryName === name) {
        this.personalDetail.countryCode = item.isoCode;
      }
    })
  }

  proceedClicked() {
    if (this.personalDetail.nationality != "Kenya") {
      this.contactBritamAlert();
      return;
    }

    if (this.buyProductReq.isNewUser) {
      this.checkIprs();
    }
    else {
      this.gotoBankDetailPage();
    }
  }

  gotoBankDetailPage() {
    this.setStagesInMongo(MongoAMCStaging.Done);

    this.buyProductReq.personalDetail = this.personalDetail;
    console.log('buyProductReq ->', this.buyProductReq);
    
    this.navCtrl.push(BankDetailsPage, { 
      "buyProductReq": this.buyProductReq, 
      "amcMongoReq": this.onboardingMongoReq 
    });
  }

  checkIprs() {
    let req = new IprsReq();
    req.lobSrc = this.buyProductReq.lobSrc
    req.firstName = this.personalDetail.firstName;
    req.middleName = this.personalDetail.middleName;
    req.lastName = this.personalDetail.lastName;
    req.clientIdentifierType = this.buyProductReq.userDetails.idType;
    req.identificationNumber = this.buyProductReq.userDetails.idValue;

    this.iprsService.checkIprs(req, (resp: IprsResp) => {
      this.iprsResp = resp;
      if (resp.isIprsUp.toLowerCase() == "true") {
        if (resp.proceedFlag.toLowerCase() == "true") {
          this.personalDetail.iprsVerified = '1';
          this.iprsVerifiedAlert();
        }
        else {
          this.personalDetail.iprsVerified = '0';
          this.iprsFailAlert()
        }
      }
      else {
        this.personalDetail.iprsVerified = '0';
        // this.iprsDownAlert();
        this.gotoBankDetailPage();//uncomment above line and remove this line when you want to shwo popup if iprs is down
      }
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.checkIprs();
          }
        })
      });
  }


  iprsVerifiedAlert() {
    let alertData: AlertInterface = {
      title: "Iprs Verified Successfully",
      message: "Click 'Proceed' to continue",
      successText: "Proceed",
      cancelText: "Cancel",
    };
    this.alert.Alert.alert(alertData.message, alertData.title, alertData.successText).then(() => {
      this.gotoBankDetailPage();
    },
      err => {
        this.setStagesInMongo(MongoAMCStaging.Pending);

        this.navCtrl.popToRoot();
      });
  }

  iprsFailAlert() {
    let alertData: AlertInterface = {
      title: "IPRS Verification Failed",
      message: "Please contact Britam Customer Care",
      successText: "OK"
    };
    this.alert.Alert.alert(alertData.message, alertData.title, alertData.successText).then(() => {
      this.setStagesInMongo(MongoAMCStaging.Pending);

      this.navCtrl.popToRoot();
    });
  }

  iprsDownAlert() {
    let alertData: AlertInterface = {
      title: "Something is wrong",
      message: "Your details are not verified. You can still 'Proceed'",
      successText: "Proceed",
      cancelText: "Cancel",
    };
    this.alert.Alert.alert(alertData.message, alertData.title, alertData.successText).then(() => {
      this.gotoBankDetailPage();
    },
      err => {
        this.setStagesInMongo(MongoAMCStaging.Pending);

        this.navCtrl.popToRoot();
      });
  }

  contactBritamAlert() {
    let alertMsg = "Thanks for submit the information. Customer Care Team will contact you.";

    this.alert.Alert.alert(alertMsg).then(() => {
      this.setStagesInMongo(MongoAMCStaging.Pending);

      this.navCtrl.popToRoot();
    });
  }

  setStagesInMongo(status: string) {
    this.mongoStages.filter(item => {
      if (item.name == "personalVerification") {
        item.status = MongoAMCStaging.Done;
      }
      else if (item.name == "otpVerification") {
        item.status = MongoAMCStaging.Done;
      }
      else if (item.name == "personalDetails") {
        item.status = status;
      }
      else if (item.name == "iprsVerification") {
        if (this.iprsResp) {
          item.status = MongoAMCStaging.Done;
        }
      }
    });

    this.onboardingMongoReq["collection"] = "cp_amc_onboarding";
    this.onboardingMongoReq["source"] = MongoSourceTag.MOBILEAPP
    this.onboardingMongoReq["channel"] = ChannelTag.MOBILE;
    this.onboardingMongoReq["TargetLob"] = "AMC",
    this.onboardingMongoReq["transactionId"] = 'TR_' + Utils.autoIncID();
    this.onboardingMongoReq["isNewUser"] = this.buyProductReq.isNewUser;
    this.onboardingMongoReq["iprsVerification"] = this.personalDetail.iprsVerified;
    this.onboardingMongoReq["personalVerification"] = this.buyProductReq.userDetails;
    this.onboardingMongoReq["personalDetails"] = {
      "firstName": this.personalDetail.firstName,
      "lastName": this.personalDetail.lastName,
      "kraPin": this.personalDetail.kraPin,
      "nationality": this.personalDetail.nationality,
      "gender": this.personalDetail.gender,
      "dob": Utils.formatIntoDateDDMMYY(this.personalDetail.dob),
      "mobileNumber": this.personalDetail.mobile,
      "physicalAddress": this.personalDetail.physicalAddress,
      "middleName": this.personalDetail.middleName,
      "emailId": this.personalDetail.email
    };
    this.onboardingMongoReq["Mobile"] = this.personalDetail.mobile;
    this.onboardingMongoReq["otpVerification"] = this.buyProductReq.otpVerification;
    this.onboardingMongoReq["stages"] = this.mongoStages;

    this.amcMongoStagesService.createAmcMongoStage(this.onboardingMongoReq, (resp) => {
      this.onboardingMongoReq["mongoId"] = resp.id;
    });
  }

}
