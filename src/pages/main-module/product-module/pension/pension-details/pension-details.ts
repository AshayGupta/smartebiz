import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AccountList } from '../../../../../dataModels/account-list.model';
import { LogonService } from '../../../../../providers/services/auth/logon.service';
import { CustomFirebaseAnalyticsProvider } from '../../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../../../common/decorators/page-track';
import { PensionAccountDetailsReq, PensionAccountDetailsResp, PensionDetailsObj } from '../../../../../dataModels/pension-account-details.model';
import { GetPensionAccountDetailsService } from '../../../../../providers/services/main-module-services/product-services/pension-services/pension-details/get-pension-account-details.service';
import { Lob } from '../../../../../common/enums/enums';
import { BeneficiaryAccountResp, BeneficiaryAccountReq, Beneficiaries } from '../../../../../dataModels/get-beneficiary-account.model';
import { Beneficiary } from '../../../../../dataModels/beneficiary.model';
import { Nominee } from '../../../../../dataModels/nominee.model';
import { BeneficiaryAction } from '../beneficiary/modify-beneficiary/modify-beneficiary';
import { GetAccountBeneficiariesService } from '../../../../../providers/services/main-module-services/product-services/pension-services/get-account-beneficiary.service';
import { ScreenOrientationService } from '../../../../../providers/plugin-services/screen-orientation.service';

export enum PensionDetailSegment {
  PersonalDetails = 'Personal Details',
}
export enum PensionDetailTags {
  PersonalDetails = 'PersonalDetails',
}

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-pension-details',
  templateUrl: 'pension-details.html',
})
export class PensionDetailsPage {

  headerTitle: string = 'My Products';
  policyData: AccountList;
  beneficiaries: Beneficiaries[] = [];
  pensionDetailsResp: PensionAccountDetailsResp;

  pensionDetailProduct = {
    segmentList: [
      { name: PensionDetailSegment.PersonalDetails, selectedTag: PensionDetailTags.PersonalDetails }
    ],
    detailObjs: {
      PersonalDetails: { name: PensionDetailSegment.PersonalDetails, isList: true, detail: [], responseReceived: false }
    }
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public logonService: LogonService,
    public alertCtrl: AlertController,
    private screenOrientationService: ScreenOrientationService,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider,
    private getPensionAccDetailsService: GetPensionAccountDetailsService,
    private getBeneficiaryAccService: GetAccountBeneficiariesService
  ) {
    this.policyData = this.navParams.get('data');
    this.pensionDetailsResp = new PensionAccountDetailsResp();
    this.pensionDetailsResp.pensionDetailsObj = new PensionDetailsObj();
  }

  ngOnInit() {
    // this.screenOrientationService.lockOrientation();
  }

  ngOnDestroy() {
    // this.screenOrientationService.unlockOrientation();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PensionDetailsPage');

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('PensionDetailsPage');

    this.getPensionPolicyDetails();
    this.getBeneficiaryDetails();
  }

  getPensionPolicyDetails() {
    let reqData = new PensionAccountDetailsReq();
    reqData.accountDetailReq.accountNumber = this.policyData.accountNumber;
    reqData.accountDetailReq.lobSrc = Lob.PENSION;
    reqData.accountDetailReq.formatted = false;

    this.getPensionAccDetailsService.getAccountDetails(reqData, (resp: PensionAccountDetailsResp) => {
      // this.pensionDetailProduct.detailObjs[PensionDetailTags.PersonalDetails].detail = resp.accountDetails;
      // this.pensionDetailProduct.detailObjs[PensionDetailTags.PersonalDetails].responseReceived = true;
      this.pensionDetailsResp.pensionDetailsObj = resp.pensionDetailsObj;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getPensionPolicyDetails();
          }
        })
      });
  }

  // Get ODS data
  getBeneficiaryDetails() {
    let reqData = new BeneficiaryAccountReq();
    reqData.LobSrc = Lob.PENSION
    reqData.memberId = this.policyData.accountNumber;

    this.getBeneficiaryAccService.getBeneficiariesAccount(reqData, (resp: BeneficiaryAccountResp) => {
      this.beneficiaryNomineeData(resp);
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getBeneficiaryDetails();
          }
        })
      });
  }

  beneficiaryNomineeData(beneficiaryDetails: BeneficiaryAccountResp) {
    for (let item of beneficiaryDetails.beneficiaries) {
      if (item.action != BeneficiaryAction.DELETE) {
        // this.beneficiary.push(item.beneficiary);
        // this.nominee.push(item.nominee);
        this.beneficiaries.push(item);
      }
    }
  }


}
