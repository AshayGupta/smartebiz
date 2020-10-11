import { BeneficiaryAccountResp, Beneficiaries } from './../../../../../../dataModels/get-beneficiary-account.model';
import { FileAttachmentReq } from "./../../../../../../dataModels/file-attachment.model";
import { Utils } from "./../../../../../../common/utils/utils";
import { AddNomineePage } from "./../add-nominee/add-nominee";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { LogonService } from "../../../../../../providers/services/auth/logon.service";
import { Beneficiary } from "../../../../../../dataModels/beneficiary.model";
import { AgeFormatInterface } from "../../../../../../common/interfaces/date.interface";
import { CustomFirebaseAnalyticsProvider } from '../../../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { BeneficiaryAction, ModifyBeneficiaryPage } from '../modify-beneficiary/modify-beneficiary';
import { RegexPattern, ApiUrl } from '../../../../../../common/constants/constants';
import { CountryCodeService } from '../../../../../../providers/services/common-pages/country-code.service';
import { CountryCodeResp, CountryCode } from '../../../../../../dataModels/country-code.model';
import { AgeValidator } from '../../../../../../common/validators/age.validation';
import { DocType, ManageCollectionDocTypeResp } from '../../../../../../dataModels/get-bank-docType.model';
import { ManageCollectionDocTypeService } from '../../../../../../providers/services/main-module-services/bank-module-services/get-bank-doc-type.service';
import { AlertService } from '../../../../../../providers/plugin-services/alert.service';
import { Nominee } from '../../../../../../dataModels/nominee.model';
import { HttpClient } from '@angular/common/http';
import { ApiRouter, Lob, StatusCode } from '../../../../../../common/enums/enums';
import { UploadDocumentReq } from '../../../../../../dataModels/upload-document.model';
import { ManageCollectionPensionResp } from '../../../../../../dataModels/manageCollection-pension.model';
import { UploadDocumentService } from '../../../../../../providers/services/main-module-services/upload-doc.service';

@IonicPage()
@Component({
  selector: "page-add-beneficiary",
  templateUrl: "add-beneficiary.html"
})
export class AddBeneficiaryPage {

  addBeneficiaryForm: FormGroup;
  submitAttempt: boolean = false;
  headerTitle: string = "";
  beneficiaryMode: string = "";
  footerBtnTxt: string = "";
  showFields: boolean = true;
  countryCodes: CountryCode[] = [];
  docType: DocType[];
  beneficiaryData: Beneficiaries;
  beneficiaryDetails: BeneficiaryAccountResp;
  addBeneficiary: Beneficiary;
  cpPension: ManageCollectionPensionResp;
  fileEvent: any;
  fileData: FileAttachmentReq;
  selectFile: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public logonService: LogonService,
    public formBuilder: FormBuilder,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider,
    public countryCodeService: CountryCodeService,
    public manageCpDocTypeService: ManageCollectionDocTypeService,
    public uploadDocumentService: UploadDocumentService,
    private alertService: AlertService,
    private http: HttpClient,
  ) {
    this.validateForm();
    this.addBeneficiary = new Beneficiary();
    
    this.beneficiaryMode = this.navParams.get("beneficiaryMode");
    this.beneficiaryData = JSON.parse(JSON.stringify(this.navParams.get("beneficiaryData")));
    this.beneficiaryDetails = this.navParams.get("beneficiaryDetails");
    this.cpPension = this.navParams.get("cpPension");
  }

  validateForm() {
    this.addBeneficiaryForm = this.formBuilder.group({
      firstName: ["", Validators.compose([Validators.required, Validators.pattern(RegexPattern.onlyContainLetters)])],
      lastName: ["", Validators.compose([Validators.required, Validators.pattern(RegexPattern.onlyContainLetters)])],
      gender: ["", Validators.compose([Validators.required])],
      dob: ["", Validators.compose([Validators.required])],
      middleName: ["", Validators.compose([Validators.pattern(RegexPattern.onlyContainLetters)])],
      // email: ["", Validators.compose([Validators.required, Validators.pattern(RegexPattern.email)])],
      mobile: [''],
      nationality: ["", Validators.compose([Validators.required])],
      relation: ["", Validators.compose([Validators.required])],
      documentType: [""],
      documentNumber: [""],
      document: [[], Validators.compose([Validators.required])]
    });
  }

  addValidations() {
    this.addBeneficiaryForm.get('dob').setValidators([
      Validators.required,
      // AgeValidator.isValid(18)
    ]);

    if (this.addBeneficiary.age >= 18) {
      this.addBeneficiaryForm.get('mobile').setValidators([
        Validators.required,
        Validators.pattern(RegexPattern.numStartWithZero), 
        Validators.pattern(RegexPattern.onlyContainNumbers), 
        Validators.minLength(10), 
        Validators.maxLength(10)
      ]);
    }
    else {
      this.addBeneficiaryForm.get('mobile').setValidators([
        Validators.pattern(RegexPattern.numStartWithZero), 
        Validators.pattern(RegexPattern.onlyContainNumbers), 
        Validators.minLength(10), 
        Validators.maxLength(10)
      ]);
    }

    this.addBeneficiaryForm.get('mobile').updateValueAndValidity();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad AddBeneficiaryPage");
    this.setupPage();
    // this.getDocType();
    this.getCountryCodes();

     // Firebase Analytics 'screen_view' event tracking
     this.customFirebaseAnalytics.trackView('Pension AddBeneficiaryPage');
  }

  setupPage() {
    if (this.beneficiaryData.beneficiary) { // condition for edit beneficiary
      this.addBeneficiary = this.beneficiaryData.beneficiary;
      this.addBeneficiaryForm.controls["document"].setValue(this.addBeneficiary.uploadDocuments);
      this.addBeneficiaryForm.controls["document"].updateValueAndValidity();
    }

    this.showFields = true;
    if (this.beneficiaryMode == "viewMode") { // condition for view beneficiary
      this.footerBtnTxt = "PROCEED";
      this.headerTitle = "View Beneficiary";
      this.showFields = false;
    }
    else {
      if (this.beneficiaryMode == "editMode") { // condition for edit beneficiary
        this.footerBtnTxt = "EDIT NOMINEE";
        this.headerTitle = "Edit Beneficiary";
      }
      else { // condition for add beneficiary
        this.footerBtnTxt = "ADD NOMINEE";
        this.headerTitle = "Add Beneficiary";
        this.addBeneficiary.lumpsum_entitlement = "0";
        this.addBeneficiary.percentage = "0";
      }

      let obj: AgeFormatInterface = {
        day: new Date(this.addBeneficiary.birthDate).getDate(),
        month: new Date(this.addBeneficiary.birthDate).getMonth(),
        year: new Date(this.addBeneficiary.birthDate).getFullYear(),
      }
      this.dobChange(obj);
    }
  }

  selectDocType() {
    
  }

  getDocType() {
    this.manageCpDocTypeService.getDocType((resp: ManageCollectionDocTypeResp) => {
      this.docType = resp.docType;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getDocType();
          }
        })
      });
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

  dobChange(event: AgeFormatInterface) {
    console.log("Date Picker", event);
    this.addBeneficiary.age = Utils.getAge(event);

    if (this.addBeneficiary.age < 18 && this.beneficiaryData.nominee) {
      this.footerBtnTxt = "EDIT NOMINEE";
    }
    else if (this.addBeneficiary.age < 18){
      this.footerBtnTxt = "ADD NOMINEE";
    }
    else {
      this.footerBtnTxt = "PROCEED";
    }
    this.addValidations();
  }

  browsefileClick(event) {
    console.log('browsefileClick event -> ', event);
    // this.addBeneficiary.uploadDocuments = [];
    if (this.addBeneficiary.uploadDocuments.length > 0) {
      this.addBeneficiaryForm.controls["document"].clearValidators();
      this.addBeneficiaryForm.controls["document"].updateValueAndValidity();
    }

    // this.handleFileUpload(event);
  }

  handleFileUpload(event) {
    console.log('handleFileUpload -> ', event);
    if (event.target.files.length == 0) {
      return;
    }

    // this.addBeneficiary.uploadDocuments = [];
    Utils.readFileInBase64(event).then((data: FileAttachmentReq) => {
      console.log("fileData->", data);
      let kb = (data.fileSize/1024);
      console.log('kb -> ', kb);

      if (kb <= 5120) {
        this.fileData = data;
        this.fileEvent = event;
        this.selectFile = false;
      }
      else {
        this.fileEvent = '';
        this.selectFile = true;
        this.alertService.Alert.alert("File size limit is 5 MB");
      }
    });
  }

  uploadFileClicked() {
    if (!this.fileEvent || this.fileEvent.target.files.length == 0) {
      this.selectFile = true;
      return;
    }

    if(!this.addBeneficiaryForm.get('documentType').value || !this.addBeneficiaryForm.get('documentNumber').value) {
      this.addBeneficiaryForm.get('documentType').setValidators([
        Validators.required,
      ]);
      this.addBeneficiaryForm.get('documentNumber').setValidators([
        Validators.required,
        Validators.minLength(8)
      ]);

      this.addBeneficiaryForm.get('documentType').updateValueAndValidity();
      this.addBeneficiaryForm.get('documentNumber').updateValueAndValidity();
      this.submitAttempt = true;
      return;
    };
    
    this.selectFile = false;

    const formData = new FormData();
    formData.append('file', this.fileEvent.target.files[0]);

    this.http.post<any>(ApiUrl.baseUrl + ApiRouter.ApiRouter2 + '/lfr/cust/upload/fileUpload', formData).subscribe(
      (res) => {
        console.log(res);
        // this.fileData.filePath = res.data.fileUrl;
        this.fileData.base64File = JSON.stringify(res.data);
        this.uploadDocument(this.fileData);
      },
      (err) => {
        console.log(err);
        this.alertService.Alert.alert("Error in uploading file");
      }
    );
  }

  uploadDocument(data: FileAttachmentReq) {
    let req = new UploadDocumentReq();
    req.folderName = "Mobile Document";
    req.fileName = data.fileName;
    req.mimeType = data.fileExtension;
    req.idType = this.cpPension.request.userDetails.idType;
    req.idValue = this.cpPension.request.userDetails.idValue;
    req.personType = "beneficiary" + this.beneficiaryData.index;
    req.transactionType = "updateBeneficiary";
    req.transactionNumber = this.cpPension.request.transactionNumber;
    req.fileBase64String = data.base64File;
    req.filePath = ''//data.filePath;
    req.policyNo = "";
    req.lob = Lob.PENSION;
    req.category = "";
    req.product = this.beneficiaryDetails.productName;
    req.docType = this.addBeneficiary.documentType;

    this.uploadDocumentService.uploadDoc(req, (res) => {
      if (!res.data.id) {
        this.resetDocUpload();
        this.alertService.Alert.alert("Error in uploading file");
        return;
      }
      let document = {
        url: res.data.url,
        id: res.data.id
      }
      console.log('document', JSON.stringify(document));

      this.selectFile = false;
      this.fileEvent = "";
      this.addBeneficiary.uploadDocuments.push(data);
      this.addBeneficiaryForm.controls["document"].setValue(this.addBeneficiary.uploadDocuments);

      this.setDocumentType(this.addBeneficiary.documentType);
    },
    (err) => {
      this.resetDocUpload();

      if(err.name === "TimeoutError") {
        this.alertService.Alert.alert("Error in uploading file");
      }
      else if (err.status == StatusCode.Status403) {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.uploadDocument(data);
          }
        })
      }
      else {
        this.alertService.Alert.alert(err.error.message)
      }
    });
  }

  setDocumentType(documentType: string) {
    let documentNumber = this.addBeneficiary.documentNumber;
    switch (documentType) {
      case "Passport":
        this.addBeneficiary.passportNo = documentNumber;
        break;
      case "'Application Form":
        this.addBeneficiary.applicationNo = documentNumber;
        break;
      case "National ID":
        this.addBeneficiary.nationalIdNumber = documentNumber;
        break;
      case "Photo":
        this.addBeneficiary.photoNo = documentNumber;
        break;
      case "Birth Certificate":
        this.addBeneficiary.birthCertificateNumber = documentNumber;
        break;
    
      default:
        break;
    }
  }

  resetDocUpload() {
    if (this.addBeneficiary.uploadDocuments.length == 0) {
      this.addBeneficiaryForm.controls['document'].reset();
    }
  }

  deleteFile(file) {
    let index = this.addBeneficiary.uploadDocuments.indexOf(file);
    if (index > -1) {
      this.addBeneficiary.uploadDocuments.splice(index, 1);
    }
  }

  verifyForm() {
    if (this.beneficiaryData.nominee) {
      if (this.beneficiaryMode == 'viewMode') {
        this.addNominee();
      }
      else {
        this.addValidations();
        if (this.addBeneficiary.age < 18) {
          this.addBeneficiaryForm.valid ? this.addNominee() : this.submitAttempt = true;
        }
        else {
          this.addBeneficiaryForm.valid ? this.submitClicked() : this.submitAttempt = true;
        }
      }
    }
    else {
      if (this.beneficiaryMode == 'viewMode') {
        this.submitClicked();
      }
      else {
        this.addValidations();
        if (this.addBeneficiary.age < 18) {
          this.addBeneficiaryForm.valid ? this.addNominee() : this.submitAttempt = true;
        }
        else {
          this.addBeneficiaryForm.valid ? this.submitClicked() : this.submitAttempt = true;
        }
      }
    }
    
  }

  submitClicked() {
    let benefObj = new Beneficiaries();
    benefObj.beneficiary = this.addBeneficiary;
    benefObj.index = this.beneficiaryData.index;
    benefObj.nominee = new Nominee();

    if (this.beneficiaryMode == 'addMode') {
      benefObj.action = BeneficiaryAction.ADD;
      let sum = 0;
      this.beneficiaryDetails.beneficiaries.filter(item => {
        if(item.action != BeneficiaryAction.DELETE) {
          sum += parseFloat(item.beneficiary.lumpsum_entitlement);
        }
      });
      benefObj.beneficiary.lumpsum_entitlement = (100 - sum).toString();
      benefObj.beneficiary.percentage = (100 - sum).toString();
      this.beneficiaryDetails.beneficiaries.push(benefObj);
    }
    else if (this.beneficiaryMode == 'editMode') {
      benefObj.action = BeneficiaryAction.MODIFY;
      this.beneficiaryDetails.beneficiaries[benefObj.index] = benefObj;
    }
    
    console.log("beneficiaryData =>" + JSON.stringify(this.beneficiaryData));
    console.log("beneficiaryDetails =>" + JSON.stringify(this.beneficiaryDetails));
    console.log("addNominee =>" + JSON.stringify(this.addNominee));
    console.log("addBeneficiary =>" + this.addBeneficiary);

    this.navCtrl.push(ModifyBeneficiaryPage, { 
      "beneficiaryDetails": this.beneficiaryDetails, 
      "copyBeneficiaryDetails": this.navParams.get("copyBeneficiaryDetails"),
      "cpPension": this.navParams.get("cpPension"),
      "pensionDetailsResp": this.navParams.get("pensionDetailsResp")
    }).then(data => {
      this.navCtrl.remove(1, this.navCtrl.getActive().index - 1);
    });
  }

  addNominee() {
    let benefObj = new Beneficiaries();
    benefObj.beneficiary = this.addBeneficiary;
    benefObj.nominee = this.beneficiaryData.nominee;
    benefObj.index = this.beneficiaryData.index;
    
    if (this.beneficiaryMode == 'addMode') {
      benefObj.action = BeneficiaryAction.ADD;
      let sum = 0;
      this.beneficiaryDetails.beneficiaries.filter(item => {
        if(item.action != BeneficiaryAction.DELETE) {
          sum += parseFloat(item.beneficiary.lumpsum_entitlement)
        }
      });
      benefObj.beneficiary.lumpsum_entitlement = (100 - sum).toString();
      benefObj.beneficiary.percentage = (100 - sum).toString();
      // this.beneficiaryDetails.beneficiaries.push(benefObj);
    }
    else if (this.beneficiaryMode == 'editMode') {
      benefObj.action = BeneficiaryAction.MODIFY;
      // this.beneficiaryDetails.beneficiaries[benefObj.index] = benefObj;
    }

    console.log("beneficiaryData =>" + JSON.stringify(this.beneficiaryData));
    console.log("beneficiaryDetails =>" + JSON.stringify(this.beneficiaryDetails));
    console.log("addNominee =>" + JSON.stringify(this.addNominee));
    console.log("addBeneficiary =>" + this.addBeneficiary);
    
    this.navCtrl.push(AddNomineePage, { 
      "beneficiaryMode": this.beneficiaryMode, 
      'beneficiaryData': benefObj, 
      "beneficiaryDetails": this.beneficiaryDetails, 
      "copyBeneficiaryDetails": this.navParams.get("copyBeneficiaryDetails"),
      "cpPension": this.navParams.get("cpPension"),
      "pensionDetailsResp": this.navParams.get("pensionDetailsResp")
    });
  }
}
