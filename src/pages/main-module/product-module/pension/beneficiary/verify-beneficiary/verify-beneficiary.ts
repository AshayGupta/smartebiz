import { Nominee } from './../../../../../../dataModels/nominee.model';
import { Beneficiaries } from './../../../../../../dataModels/get-beneficiary-account.model';
import { Beneficiary } from './../../../../../../dataModels/beneficiary.model';
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Modal, ModalController } from "ionic-angular";
import { BeneficiaryAccountResp } from "../../../../../../dataModels/get-beneficiary-account.model";
import { SignupReq } from '../../../../../../dataModels/signup.model';
import { LocalStorageKey, PageName, Lob, ClientDetailsStorageKey } from '../../../../../../common/enums/enums';
import { OtpPage, OtpScreenData } from '../../../../../auth-pages/otp/otp';
import { AccountList } from '../../../../../../dataModels/account-list.model';
import { CustomFirebaseAnalyticsProvider } from '../../../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { BeneficiaryAction } from '../modify-beneficiary/modify-beneficiary';
import { CategoryMatrixReq } from '../../../../../../dataModels/category-matrix.model';
import { CreateSrPdfReq } from '../../../../../../dataModels/create-sr-pdf.model';
import { ManageCollectionPensionResp } from '../../../../../../dataModels/manageCollection-pension.model';
import { GetPdfFileAsBase64Req } from '../../../../../../dataModels/get-pdf-file-as-base64.model';
import { RaiseServiceRequestReq } from '../../../../../../dataModels/raise-service-request.model';
import { Utils } from '../../../../../../common/utils/utils';
import { FinalDocProcessReq } from '../../../../../../dataModels/final-doc-process.model';
import { AlertService } from '../../../../../../providers/plugin-services/alert.service';
import { PensionAccountDetailsResp } from '../../../../../../dataModels/pension-account-details.model';
import { ClientDetailsReq, ClientDetailsResp } from '../../../../../../dataModels/client-details.model';
import { LogonService } from '../../../../../../providers/services/auth/logon.service';
import { ClientDetailsService } from '../../../../../../providers/services/main-module-services/product-services/client-details.service';
import { TermAndCondition } from '../../../../../../dataModels/amc-mongo-stages.model';
import { HtmlContentReq, HtmlContentResp } from '../../../../../../dataModels/html-content.model';
import { HtmlContentService } from '../../../../../../providers/services/common-pages/html-content.service';
import { InitialWithdrawTncPage } from '../../initial-withdraw-module/initial-withdraw-tnc/initial-withdraw-tnc';

@IonicPage()
@Component({
  selector: "page-verify-beneficiary",
  templateUrl: "verify-beneficiary.html"
})
export class VerifyBeneficiaryPage {

  headerTitle: string = "Verify Modifications";
  beneficiaryMode: string = "verifyMode";
  beneficiaryDetails: BeneficiaryAccountResp;
  beneficiaries: Beneficiaries[] = [];
  // nominee: Nominee[] = [];
  otpData: OtpScreenData = new OtpScreenData();
  cpPension: ManageCollectionPensionResp;
  contactId: string;
  tnc = new TermAndCondition();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider,
    public alertService: AlertService,
    public clientDetailsService: ClientDetailsService,
    public logonService: LogonService,
    public htmlContentService: HtmlContentService,
    public modalCtrl: ModalController,
  ) {
    this.beneficiaryDetails = this.navParams.get("beneficiaryDetails");
    this.cpPension = this.navParams.get('cpPension');

    console.log('VerifyBeneficiaryPage beneficiaryDetails -> ', this.beneficiaryDetails);
    console.log('VerifyBeneficiaryPage cpPension -> ', this.cpPension);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad VerifyBeneficiaryPage");
    this.tnc.checked = false;
    this.openTnC();

    this.setupPage();

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('Pension VerifyBeneficiaryPage');
  }

  setupPage() {
    for (let item of this.beneficiaryDetails.beneficiaries) {
      if (item.action != BeneficiaryAction.DELETE) {
        this.beneficiaries.push(item);
        // this.nominee.push(item.nominee);
      }
    }

    this.otpData.navigateFromPage = PageName.VerifyBeneficiaryPage;
    this.otpData.title = 'Verify OTP'
    this.otpData.subTitle = 'Product : ' + this.beneficiaryDetails.productName + ' - ' + this.beneficiaryDetails.policyNumber;

    this.getClientDetails();
  }

  openTnC() {
    let htmlReq = new HtmlContentReq();
    htmlReq.contentType = 'pension update beneficiary';

    this.htmlContentService.getHtmlFromServer(htmlReq, (resp: HtmlContentResp) => {
      this.tnc.termAndCondition = resp.content;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.openTnC();
          }
        })
      });
  }

  openTncModal() {
    if (this.tnc.termAndCondition == undefined) {
      this.tnc.termAndCondition = "terms and conditions not found."
    }
    let options = {
      showBackdrop: true,
      enableBackdropDismiss: true,
    };
    let tncModal: Modal = this.modalCtrl.create(InitialWithdrawTncPage, { 'tnc': this.tnc.termAndCondition, 'nav': this.navCtrl }, options);
    tncModal.present();
  }
  
  cancelClick() {
    let deleteMsg: string = "Do you really want to delete?";
    let titleMsg: string = "You are almost done!";
    let successBtn: string = "YES";
    let failureBtn: string = "NO";

    this.alertService.Alert.confirm(deleteMsg, titleMsg, failureBtn, successBtn).then(res => {
      this.navCtrl.popTo(this.navCtrl.getByIndex(1));
    },
      error => {

      });
  }

  modifyClick() {
    this.navCtrl.pop();
  }

  verifyOtp() {
    if (!this.tnc.checked) return;
    this.cpPension.request.TermAndCondition = this.tnc;

    let catMatReq = this.createCategoryMatrixReq();
    let pdfReq = this.createPdfReq();
    let base64Req = this.getPdfFileAsBase64Req();
    let serviceReq = this.createServiceReq();
    let docReq = this.finalDocProcessReq();

    let signupReq = new SignupReq();
    signupReq.idOptionKey = 'nationalId';
    signupReq.idValue = localStorage.getItem(LocalStorageKey.NationalID);

    this.navCtrl.push(OtpPage, {
      'signupData': signupReq, 
      'otpData': this.otpData,
      'cpPension': this.cpPension,
      'categoryMatrixReq': catMatReq,
      'createSrPdfReq': pdfReq,
      'getPdfFileAsBase64Req': base64Req,
      'raiseServiceReq': serviceReq,
      'finalDocProcessReq': docReq
    });
  }

  createCategoryMatrixReq() {
    let catMatReq = new CategoryMatrixReq();
    catMatReq.lob = "Retail Pension";
    catMatReq.action = "UpdateBeneficiary";

    return catMatReq;
  }

  createPdfReq() {
    let pdfReq = new CreateSrPdfReq();
    pdfReq.category = "";
    pdfReq.clientDetailsJson = this.updateClientDetailJson();
    pdfReq.jsonArray =  this.updateJsonArray();
    pdfReq.folderName = "Customer Portal";
    pdfReq.idType = this.cpPension.request.userDetails.nationalIdType;
    pdfReq.idValue = this.cpPension.request.userDetails.nationalId;
    pdfReq.lob = Lob.PENSION;
    pdfReq.personType = "pdf";
    pdfReq.policyNo = this.beneficiaryDetails.policyNumber;
    pdfReq.product = this.beneficiaryDetails.productName;
    pdfReq.transactionNumber = this.cpPension.request.transactionNumber;
    pdfReq.transactionType = "updateBen";
    pdfReq.type = "update-ben-pdf";
    pdfReq.userid = "";

    return pdfReq;
  }

  updateJsonArray() {
    let array: Beneficiaries[] = this.cpPension.request.UpdateODSData;
    let jsonArray = [];

    array.filter(item => {
      let obj = {
        dateImported: '',
        beneficiary: {},
        nominee: {}
      };

      obj.dateImported = item.dateImported;
      
      obj.beneficiary['firstName'] = item.beneficiary.firstName || "";
      obj.beneficiary['middleName'] = item.beneficiary.middleName || "";
      obj.beneficiary['lastName'] = item.beneficiary.lastName || "";
      obj.beneficiary['gender'] = item.beneficiary.gender || "";
      obj.beneficiary['relationshipType'] = item.beneficiary.relationshipType || "";
      obj.beneficiary['relationshipCode'] = item.beneficiary.relationshipCode || "";
      obj.beneficiary['mobileNO'] = item.beneficiary.mobileNo || "";
      obj.beneficiary['personNumber'] = item.beneficiary.personNumber || "";
      obj.beneficiary['birthDate'] = Utils.formatIntoDateDDMMYY(item.beneficiary.birthDate) || "";
      obj.beneficiary['birthCertificateNumber'] = item.beneficiary.birthCertificateNumber || "";
      obj.beneficiary['lumpsum_entitlement'] = item.beneficiary.lumpsum_entitlement || "";
      obj.beneficiary['nationalIdNumber'] = item.beneficiary.nationalIdNumber || "";
      obj.beneficiary['email'] = item.beneficiary.email || "";
      obj.beneficiary['percentage'] = item.beneficiary.lumpsum_entitlement || "";

      obj.nominee['firstName'] = item.nominee.firstName || "";
      obj.nominee['middleName'] = item.nominee.middleName || "";
      obj.nominee['lastName'] = item.nominee.lastName || "";
      obj.nominee['gender'] = item.nominee.gender || "";
      obj.nominee['relationshipType'] = item.nominee.relationshipType || "";
      obj.nominee['relationshipCode'] = item.nominee.relationshipCode || "";
      obj.nominee['mobileNO'] = item.nominee.mobileNO || "";
      obj.nominee['personNumber'] = item.nominee.personNumber || "";
      obj.nominee['birthDate'] = Utils.formatIntoDateDDMMYY(item.nominee.birthDate) || "";
      obj.nominee['birthCertificateNumber'] = item.nominee.birthCertificateNumber || "";
      obj.nominee['lumpsum_entitlement'] = item.nominee.lumpsum_entitlement || "";
      obj.nominee['nationalIdNumber'] = item.nominee.nationalIdNumber || "";
      obj.nominee['email'] = item.nominee.email || "";
      obj.nominee['percentange'] = item.nominee.lumpsum_entitlement || "";

      jsonArray.push(obj);
    });

    return jsonArray;
  }

  updateClientDetailJson() {
    let obj = {};

    let pensionDetailsResp: PensionAccountDetailsResp = this.navParams.get("pensionDetailsResp");
    let pensionObj = pensionDetailsResp.pensionDetailsObj;

    obj['name'] = pensionObj.first_name + " " + pensionObj.other_names + " " + pensionObj.sur_name;
    obj['scheme'] = pensionObj.scheme_name;
    obj['sponsor'] = pensionObj.sposor_name;
    obj['dob'] = Utils.formatIntoDateDDMMYY(pensionObj.dob);
    obj['email'] = localStorage.getItem(ClientDetailsStorageKey.Email);
    obj['phone'] = localStorage.getItem(ClientDetailsStorageKey.PhoneNumber);
    obj['memberNo'] = pensionObj.member_number;
    obj['nId'] = pensionObj.id_no;
    obj['memberPin'] = pensionObj.pin;

    return obj
  }

  getPdfFileAsBase64Req() {
    let base64Req = new GetPdfFileAsBase64Req();
    base64Req.transactionNumber = this.cpPension.request.transactionNumber;
    base64Req.docType = 'allDoc'
    
    return base64Req;
  }

  createServiceReq() {
    let srReq = new RaiseServiceRequestReq();
    srReq.autoIncID = 'C' + Utils.autoIncID();
    srReq.commMethod = 'Customer';
    srReq.userDetails.idValue = this.cpPension.request.userDetails.idValue;
    srReq.userDetails.idType = this.cpPension.request.userDetails.idType;
    srReq.contactId = this.contactId;
    // srReq.policyNo = this.beneficiaryDetails.policyNumber;
    srReq.attachment = [];
    srReq.message = this.setSummary();

    return srReq
  }

  setSummary() {
    let message = "NATIONAL ID=" + this.cpPension.request.userDetails.idValue + 
                  ",Policy Number=" + this.beneficiaryDetails.policyNumber +
                  ",Transaction ID=" + this.cpPension.request.transactionNumber

    this.cpPension.request.UpdateODSData.filter(item => {
      message += ",Beneficiary Name=" + 
                item.beneficiary.firstName + " " 
                item.beneficiary.middleName + " " +
                item.beneficiary.lastName + 
                ",Lumpsum Entitlement=" + 
                item.beneficiary.lumpsum_entitlement +
                ",Nominee Name=" +
                item.nominee.firstName + " " 
                item.nominee.middleName + " " +
                item.nominee.lastName
    });
    
    return message
  }

  finalDocProcessReq() {
    let docReq = new FinalDocProcessReq();

    docReq.emailAddress = localStorage.getItem(ClientDetailsStorageKey.Email);
    docReq.customerName = localStorage.getItem(ClientDetailsStorageKey.FirstName)+' '+localStorage.getItem(ClientDetailsStorageKey.MiddleName)+' '+localStorage.getItem(ClientDetailsStorageKey.LastName);
    docReq.policyNo = this.beneficiaryDetails.policyNumber;
    docReq.transactionType = "updateBeneficiary";
    docReq.accountNumber = this.beneficiaryDetails.policyNumber;
    docReq.transactionNumber = this.cpPension.request.transactionNumber;

    return docReq;
  }

  getClientDetails() {
    let reqData = new ClientDetailsReq();
    reqData.nationalIdNumber = this.cpPension.request.userDetails.idValue;
    reqData.lobSrc = ''; // dynamic from category basis

    this.clientDetailsService.getClientDetails(reqData, (resp: ClientDetailsResp) => {
      this.contactId = resp.contactId;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getClientDetails();
          }
        })
      });
  }

}
