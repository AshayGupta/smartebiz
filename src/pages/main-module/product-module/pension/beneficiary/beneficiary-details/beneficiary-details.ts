import { AddBeneficiaryPage } from '../add-beneficiary/add-beneficiary';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModifyBeneficiaryPage, BeneficiaryAction } from '../modify-beneficiary/modify-beneficiary';
import { AccountList } from '../../../../../../dataModels/account-list.model';
import { LogonService } from '../../../../../../providers/services/auth/logon.service';
import { GetAccountBeneficiariesService } from '../../../../../../providers/services/main-module-services/product-services/pension-services/get-account-beneficiary.service';
import { BeneficiaryAccountResp, BeneficiaryAccountReq, Beneficiaries } from '../../../../../../dataModels/get-beneficiary-account.model';
import { CustomFirebaseAnalyticsProvider } from '../../../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { AlertService } from '../../../../../../providers/plugin-services/alert.service';
import { ManageCollectionPensionService } from '../../../../../../providers/services/main-module-services/product-services/pension-services/get-manageCollection-pension.service';
import { ManageCollectionPensionReq, ManageCollectionPensionResp } from '../../../../../../dataModels/manageCollection-pension.model';
import { Utils } from '../../../../../../common/utils/utils';
import { GetPensionAccountDetailsService } from '../../../../../../providers/services/main-module-services/product-services/pension-services/pension-details/get-pension-account-details.service';
import { PensionAccountDetailsReq, PensionAccountDetailsResp, PensionDetailsObj } from '../../../../../../dataModels/pension-account-details.model';
import { Lob } from '../../../../../../common/enums/enums';
import { PageSegmentInterface } from '../../../../../../common/interfaces/page-segment.interface';
import { Environment } from '../../../../../../common/constants/constants';


export enum PensionSegment {
  ProductSummary = 'Policy Summary',
}

export enum PensionTags {
  ProductSummary = 'ProductSummary',
}

@IonicPage()
@Component({
  selector: 'page-beneficiary-details',
  templateUrl: 'beneficiary-details.html',
})
export class BeneficiaryDetailsPage {

  headerTitle: string = 'My Products';
  policyData: AccountList;
  beneficiaryMode: string = "viewMode";
  private beneficiaryDetails: BeneficiaryAccountResp;
  copyBeneficiaryDetails: BeneficiaryAccountResp;
  cpPension: ManageCollectionPensionResp;
  segmentInput: PageSegmentInterface[] = [];
  selectedTag: string;
  pensionDetailsResp: PensionAccountDetailsResp;

  pensionProduct = {
    segmentList: [
      { name: PensionSegment.ProductSummary, selectedTag: PensionTags.ProductSummary }
    ],
    detailObjs: {
      ProductSummary: { name: PensionSegment.ProductSummary, isList: true, detail: [], responseReceived: false }
    }
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public logonService: LogonService,
    public getBeneficiaryAccService: GetAccountBeneficiariesService,
    public getPensionAccDetailsService: GetPensionAccountDetailsService,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider,
    public alert: AlertService,
    public collectionPensionService: ManageCollectionPensionService
  ) {
    this.pensionDetailsResp = new PensionAccountDetailsResp();
    this.pensionDetailsResp.pensionDetailsObj = new PensionDetailsObj();
    this.copyBeneficiaryDetails = new BeneficiaryAccountResp();
    this.policyData = this.navParams.get('policyData');
  }

  ngOnInit(): void {
    this.getBeneficiaryDetails();

    this.segmentInput = <any>this.pensionProduct.segmentList;
    // this.detailObj = this.pensionProduct.detailObjs;
    this.selectedTag = this.segmentInput[0].selectedTag;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BeneficiaryDetailsPage');
    this.getPensionPolicyDetails();

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('BeneficiaryDetailsPage');

    this.copyBeneficiaryDetails.policyNumber = this.policyData.accountNumber;
    this.copyBeneficiaryDetails.productName = this.policyData.productName;
  }

  getPensionPolicyDetails() {
    let reqData = new PensionAccountDetailsReq();
    reqData.accountDetailReq.accountNumber = this.policyData.accountNumber;
    reqData.accountDetailReq.lobSrc = Lob.PENSION;
    reqData.accountDetailReq.formatted = false;

    this.getPensionAccDetailsService.getAccountDetails(reqData, (resp: PensionAccountDetailsResp) => {
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
      resp.policyNumber = this.policyData.accountNumber;
      resp.productName = this.policyData.productName;

      this.beneficiaryDetails = JSON.parse(JSON.stringify(resp));
      this.copyBeneficiaryDetails = JSON.parse(JSON.stringify(resp));  //ODS data
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getBeneficiaryDetails();
          }
        })
      });
  }

  editBeneficiaryClicked() {
    this.getCPCollection();
  }

  getCPCollection() {
    let req = new ManageCollectionPensionReq();
    req.policyNo = this.policyData.accountNumber;

    this.collectionPensionService.getCollectionPension(req, (resp: ManageCollectionPensionResp) => {
      this.cpPension = resp;

      if (!resp.request) {
        this.goToModifyBeneficiaryPage();
      }
      else {
        if (resp.id && Utils.isEmpty(resp.request.SR_Number)) {
          this.previousChangesPopup(resp);
        }
        else {
          this.checkCreationDates(resp);
        }
      }
    },
    error => {
      this.goToModifyBeneficiaryPage();
    });
  }

  previousChangesPopup(obj: ManageCollectionPensionResp) {
    let alertTitle = "";
    let alertMsg = "Do you want to continue with previous changes ?";
    let cancelTxt = "NO";
    let successTxt = "YES";

    this.alert.Alert.confirm(alertMsg, alertTitle, cancelTxt, successTxt).then(res => {
      this.beneficiaryDetails.dateImported = obj.request.dateImported;
      this.beneficiaryDetails.beneficiaries = obj.request.UpdateODSData;
      this.goToModifyBeneficiaryPage();
    }, err => {
      this.beneficiaryDetails = this.copyBeneficiaryDetails;
      this.goToModifyBeneficiaryPage();
    });
  }

  checkCreationDates(obj: ManageCollectionPensionResp) {
    let d1 = new Date(this.copyBeneficiaryDetails.dateImported).getTime();   // ods date
    let d2 = new Date(obj.request.dateImported).getTime();    // SR No creation date

    if (d2 > d1) {
      let alertTitle = "";
      let alertMsg = "An existing Service Request is already in open state, please await for the closure before initiating a new one. SR Number : " + obj.request.SR_Number;
      let successTxt = "OK";
      
      this.alert.Alert.alert(alertMsg, alertTitle, successTxt).then(res => {
        if(Environment.qa || Environment.uat || Environment.uatHttps) {
          this.goToModifyBeneficiaryPage();
        }
      }, err => {
      });
    }
    else {
      this.goToModifyBeneficiaryPage();
    }
  }

  // Action emit from edit-beneficiary
  beneficiaryAction(data, index) {
    console.log('beneficiaryAction ->', data);
    this.navCtrl.push(AddBeneficiaryPage, {
      "beneficiaryMode": data.beneficiaryMode,
      "beneficiaryData": data.beneficiaryData,
      "beneficiaryDetails": data.beneficiaryDetails
    });
  }

  // Modify beneficiary page
  goToModifyBeneficiaryPage() {
    console.log('---', this.beneficiaryDetails);
    console.log('---', this.copyBeneficiaryDetails);

    this.navCtrl.push(ModifyBeneficiaryPage, {
      "beneficiaryMode": "editMode",
      "beneficiaryDetails": this.beneficiaryDetails,
      "copyBeneficiaryDetails": this.beneficiaryDetails,
      "pensionDetailsResp": this.pensionDetailsResp,
      "cpPension": this.cpPension
    });
  }

  // Add beneficiary when their is no beneficiary
  addBeneficiaryClicked() {
    this.editBeneficiaryClicked();
  }

  accordionOutput(tag: string) {
  }

}