import { AlertService } from './../../../../providers/plugin-services/alert.service';
import { ApiUrl } from './../../../../common/constants/constants';
import { UpdateProfilePicService } from './../../../../providers/services/common-pages/update-profile-pic.service';
import { CameraService } from './../../../../providers/plugin-services/camera.service';
import { ActionsheetService } from './../../../../providers/plugin-services/actionsheet.service';
import { UpdatePasswordPage } from './../../../auth-pages/update-password/update-password';
import { Utils } from './../../../../common/utils/utils';
import { FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, PopoverOptions } from 'ionic-angular';
import { ClientDetailsReq, ClientDetailsResp } from '../../../../dataModels/client-details.model';
import { LocalStorageKey, ClientDetailsStorageKey } from '../../../../common/enums/enums';
import { ClientDetailsService } from '../../../../providers/services/main-module-services/product-services/client-details.service';
import { LogonService } from '../../../../providers/services/auth/logon.service';
import { ProfileDetails } from '../../../../dataModels/profile.model';
import { UpdateProfilePicReq, UpdateProfilePicResp } from '../../../../dataModels/update-profile-pic.model';
import { GetProfilePicService } from '../../../../providers/services/common-pages/get-profile-pic.service';
import { GetProfilePicReq, GetProfilePicResp } from '../../../../dataModels/get-profile-pic.model';
import { CustomFirebaseAnalyticsProvider } from '../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../../common/decorators/page-track';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  headerTitle: string;
  profileForm: FormGroup
  profileDetail = new ProfileDetails();
  img: string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public popoverCtrl: PopoverController,
    public clientDetailsService: ClientDetailsService,
    public logonService: LogonService,
    public actionsheetService: ActionsheetService,
    private cameraService: CameraService,
    private updateProfilePicService: UpdateProfilePicService,
    private getProfilePicService: GetProfilePicService,
    private alertService: AlertService,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider
  ) {
  } 

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.setupPage();

     // Firebase Analytics 'screen_view' event tracking
     this.customFirebaseAnalytics.trackView('ProfilePage'); 
  }

  setupPage() {
    this.headerTitle = 'My Profile';
    this.getCRMClientDetails();
    this.getProfilePic();
  }

  getCRMClientDetails() {
    let reqData = new ClientDetailsReq();
    reqData.nationalIdNumber = localStorage.getItem(LocalStorageKey.NationalID);
    reqData.lobSrc = '';

    this.clientDetailsService.getClientDetails(reqData, (resp: ClientDetailsResp) => {
      this.profileDetail.initials = ''//resp.salutation;
      this.profileDetail.firstName = resp.firstName+' '+resp.middleName+' '+resp.surname;
      this.profileDetail.dateOfBirth = Utils.formatDateDDMMYY(resp.dateOfBirth);
      this.profileDetail.gender = resp.gender == 'F' ? 'Female' : resp.gender == 'M' ? 'Male' : '';
      this.profileDetail.phone = resp.contacts[0].mobile; //localStorage.getItem(ClientDetailsStorageKey.PhoneNumber);
      this.profileDetail.email = resp.contacts[0].email; //localStorage.getItem(ClientDetailsStorageKey.Email);
      this.profileDetail.address = ''//resp.addresses[0].postalAddress + ',' + resp.addresses[0].city + ',' + resp.addresses[0].country;
      this.profileDetail.postalCode = ''//resp.addresses[0].postalCode;
      this.profileDetail.taxNo = resp.pinNumber;
      this.profileDetail.nationalID = resp.nationalIdNumber;
      this.profileDetail.passportNo = resp.passportNumber;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getCRMClientDetails();
          }
        })
      });
  }

  getProfilePic() {
    let pic = localStorage.getItem(LocalStorageKey.ProfilePic);
    if (!Utils.isEmpty(pic)) {
      this.img = ApiUrl.profileImgUrl + pic;
      return;
    }

    var req = new GetProfilePicReq();
    req.idType = localStorage.getItem(LocalStorageKey.NationalIDType);
    req.idValue = localStorage.getItem(LocalStorageKey.NationalID);

    this.getProfilePicService.getProfilePic(req, (resp: GetProfilePicResp) => {
      if (resp.profileUrl) {
        this.img = ApiUrl.profileImgUrl + resp.profileUrl;
        localStorage.setItem(LocalStorageKey.ProfilePic, resp.profileUrl);
      }
    },
    error=> {
    })
  }

  updatePassword() {
    let options: PopoverOptions = {
      showBackdrop: true,
      enableBackdropDismiss: true,
    };

    let popover = this.popoverCtrl.create(UpdatePasswordPage, options);
    popover.present();
  }

  updateProfilePic() {
    this.actionsheetService.ActionSheet.profilePicSheet().then(resp => {
      console.log(resp);

      switch (resp) {
        case 'gallery':
          this.selectSource('PHOTOLIBRARY');
          break;

        case 'camera':
          this.selectSource('CAMERA');
          break;

        default:
          break;
      }
    })
  }

  selectSource(source: string) {
    this.cameraService.takePicture(source).then((imgData: string) => {
      this.uploadImg(imgData);
    },
    error => {
      console.log('cameraService Error: ', error);
    })
  }

  uploadImg(imgData: string) {
    var req = new UpdateProfilePicReq();
    req.idType = localStorage.getItem(LocalStorageKey.NationalIDType);
    req.idValue = localStorage.getItem(LocalStorageKey.NationalID);
    req.profilePic = imgData;

    this.updateProfilePicService.updateProfilePic(req, (resp: UpdateProfilePicResp) => {
      this.img = imgData;
      this.alertService.Alert.alert("Profile Picture updated successfully").then(res => {
      },
      error => {
      });
      localStorage.setItem(LocalStorageKey.ProfilePic, this.img);
    },
    error => {
      this.alertService.Alert.alert(error).then(res => {
      },
        error => {
        });
    })
  }

}
