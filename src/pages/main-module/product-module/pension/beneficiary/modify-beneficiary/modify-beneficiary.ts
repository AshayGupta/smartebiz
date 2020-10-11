import { LocalStorageKey, MongoAMCStaging, MongoSourceTag, ChannelTag } from './../../../../../../common/enums/enums';
import { AddBeneficiaryResp, AddBeneficiaryReq } from './../../../../../../dataModels/add-beneficiary.mode';
import { AddBeneficiaryService } from './../../../../../../providers/services/main-module-services/product-services/pension-services/add-beneficiary.service';
import { VerifyBeneficiaryPage } from "./../verify-beneficiary/verify-beneficiary";
import { Component, Input } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AddBeneficiaryPage } from "../add-beneficiary/add-beneficiary";
import { BeneficiaryAccountResp } from "../../../../../../dataModels/get-beneficiary-account.model";
import { LogonService } from "../../../../../../providers/services/auth/logon.service";
import { StatusCode } from '../../../../../../common/enums/enums';
import { AccountList } from '../../../../../../dataModels/account-list.model';
import { CustomFirebaseAnalyticsProvider } from '../../../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { ManageCollectionPensionResp } from '../../../../../../dataModels/manageCollection-pension.model';
import { UserDetails } from '../../../../../../dataModels/user-details.model';
import { Stages } from '../../../../../../dataModels/amc-mongo-stages.model';
import { AlertService } from '../../../../../../providers/plugin-services/alert.service';
import { CreateTransactionService } from '../../../../../../providers/services/main-module-services/buy-product-module-services/create-transaction.service';
import { CreateTransactionResp, CreateTransactionReq } from '../../../../../../dataModels/create-transaction.model';
import { GetTransactionNumberReq } from '../../../../../../dataModels/get-transaction-number.model';
import { GetTransactionNumberService } from '../../../../../../providers/services/main-module-services/buy-product-module-services/get-transaction-number.service';
import { Utils } from '../../../../../../common/utils/utils';

export enum BeneficiaryAction {
  DELETE = "delete",
  ADD = "add",
  MODIFY = "modify"
}

@IonicPage()
@Component({
  selector: "page-modify-beneficiary",
  templateUrl: "modify-beneficiary.html"
})
export class ModifyBeneficiaryPage {

  headerTitle: string = "Modify Beneficiary";
  beneficiaryMode: string = "editMode";
  beneficiaryDetails: BeneficiaryAccountResp;
  copyBeneficiaryDetails: BeneficiaryAccountResp;
  cpPension: ManageCollectionPensionResp;
  mongoStages: Stages[] = [{
    name: "Add/Update",
    status: MongoAMCStaging.Done,
  },
  {
    name: "OTP Verified",
    status: MongoAMCStaging.Pending
  },
  {
    name: "SR Creation",
    status: MongoAMCStaging.Pending
  }
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public logonService: LogonService,
    public addBeneficiaryService: AddBeneficiaryService,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider,
    private alertService: AlertService,
    public createTransactionService: CreateTransactionService,
    public getTransactionNumberService: GetTransactionNumberService,
  ) {
    this.beneficiaryDetails = new BeneficiaryAccountResp();
    this.beneficiaryDetails = JSON.parse(JSON.stringify(this.navParams.get("beneficiaryDetails")));
    this.copyBeneficiaryDetails = JSON.parse(JSON.stringify(this.navParams.get("copyBeneficiaryDetails")));
    this.cpPension = this.navParams.get("cpPension");
    console.log('beneficiaryDetails from modify const ->', this.beneficiaryDetails);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ModifyBeneficiaryPage");
    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('Pension ModifyBeneficiaryPage');

    if (!this.cpPension) {
      this.cpPension = new ManageCollectionPensionResp();
      this.cpPension.request = new AddBeneficiaryReq();

      this.cpPension.request.userDetails = new UserDetails();
      this.cpPension.request.userDetails.nationalId = localStorage.getItem(LocalStorageKey.NationalID);
      this.cpPension.request.userDetails.nationalIdType = localStorage.getItem(LocalStorageKey.NationalIDType);
    }

    if (!this.cpPension.request.transactionNumber) {
      this.getTransactionNumber().then((tranNum: string) => {
        this.cpPension.request.transactionNumber = tranNum;
      });
    }
  }

  revertChangesClicked(event) {
    this.beneficiaryDetails = event;
  }

  deleteBeneficiaryClicked(index) {

  }

  async updateDetailsClicked() {
    let percentSum = 0;
    let isValid: boolean = true;

    this.beneficiaryDetails.beneficiaries.filter(item => {
      if (item.action != BeneficiaryAction.DELETE) {
        percentSum += parseFloat(item.beneficiary.lumpsum_entitlement);
        if(parseFloat(item.beneficiary.lumpsum_entitlement) <= 0) {
          isValid = false;
        }
      }
    })

    if (percentSum != 100 || !isValid) {
      // let msg = "Sum of Lumpsum Entitlement of Beneficiaries should be 100";
      // let successBtn = "OK";
      // this.alertService.Alert.alert(msg, "", successBtn).then(res => {
      // });
    }
    else {
      this.updateDetails(this.cpPension)
    }
  }

  updateDetails(cpPensionData: ManageCollectionPensionResp) {
    let userDetails = new UserDetails();
    userDetails.idType = localStorage.getItem(LocalStorageKey.NationalIDType);
    userDetails.idValue = localStorage.getItem(LocalStorageKey.NationalID);

    this.mongoStages.filter(item => {
      if (item.name == "Add/Update") {
        item.status = MongoAMCStaging.Done;
      }
    });

    cpPensionData.request.source = MongoSourceTag.MOBILEAPP;
    cpPensionData.request.channel = ChannelTag.MOBILE;
    cpPensionData.request.TargetLob = "Pension";
    cpPensionData.request.transactionId = 'TR_' + Utils.autoIncID();
    cpPensionData.request.dateImported = new Date().toUTCString();

    if (!cpPensionData.id || !cpPensionData.request) {
      cpPensionData.request.mongoId = "";
      cpPensionData.request.collection = "cp_pension";
      cpPensionData.request.userDetails = userDetails;
      cpPensionData.request.ODSData = this.copyBeneficiaryDetails.beneficiaries;
      cpPensionData.request.SR_Number = "";
      cpPensionData.request.stages = this.mongoStages;
      cpPensionData.request.PolicyDetails = {policyNo: ''};
      cpPensionData.request.PolicyDetails.policyNo = this.copyBeneficiaryDetails.policyNumber;
      cpPensionData.request.UpdateODSData = this.beneficiaryDetails.beneficiaries;
      cpPensionData.request.isUpdate = "true";
    }
    else {
      cpPensionData.request.stages = this.mongoStages;
      cpPensionData.request.UpdateODSData = this.beneficiaryDetails.beneficiaries;
      cpPensionData.request.isUpdate = "true";
    }

    console.log('updateDetails ->', cpPensionData);
    this.addBeneficiaryService.addBeneficiary(cpPensionData.request, (resp: AddBeneficiaryResp) => {
      this.navCtrl.push(VerifyBeneficiaryPage, {
        "beneficiaryDetails": this.beneficiaryDetails,
        "cpPension": cpPensionData,
        "pensionDetailsResp": this.navParams.get("pensionDetailsResp")
      });
    },
      (err) => {
        if (err.status == StatusCode.Status403) {
          this.logonService.getToken((isTokenValid: boolean) => {
            if (isTokenValid) {
              this.updateDetails(cpPensionData);
            }
          })
        }
      });
  }

  getTransactionNumber() {
    return new Promise((resolve, reject) => {
      let req = new GetTransactionNumberReq();
      req.transactionType = "updateBeneficiary";
      req.policyNumber = this.beneficiaryDetails.policyNumber;

      this.getTransactionNumberService.getTransactionNumber(req, (resp) => {
        resolve(resp.transactionNumber);
      })
    });
  }


  // Action emit from edit-beneficiary
  beneficiaryAction(data) {
    console.log('beneficiaryAction -> ', data);
    this.navCtrl.push(AddBeneficiaryPage, {
      "beneficiaryMode": data.beneficiaryMode,
      "beneficiaryData": data.beneficiaryData,
      "beneficiaryDetails": data.beneficiaryDetails,
      "copyBeneficiaryDetails": this.copyBeneficiaryDetails,
      "cpPension": this.cpPension,
      "pensionDetailsResp": this.navParams.get("pensionDetailsResp")
    });
  }

}
