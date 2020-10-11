import { BeneficiaryAccountResp } from './../../../../../../dataModels/get-beneficiary-account.model';
import { ModifyBeneficiaryPage, BeneficiaryAction } from './../modify-beneficiary/modify-beneficiary';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams, Alert } from "ionic-angular";
import { LogonService } from "../../../../../../providers/services/auth/logon.service";
import { Utils } from '../../../../../../common/utils/utils';
import { FileAttachmentReq } from '../../../../../../dataModels/file-attachment.model';
import { Nominee } from '../../../../../../dataModels/nominee.model';
import { Beneficiaries } from '../../../../../../dataModels/get-beneficiary-account.model';
import { AgeFormatInterface } from '../../../../../../common/interfaces/date.interface';
import { CustomFirebaseAnalyticsProvider } from '../../../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { RegexPattern, ApiUrl } from '../../../../../../common/constants/constants';
import { CountryCodeService } from '../../../../../../providers/services/common-pages/country-code.service';
import { CountryCodeResp, CountryCode } from '../../../../../../dataModels/country-code.model';
import { AlertService } from '../../../../../../providers/plugin-services/alert.service';
import { DocType, ManageCollectionDocTypeResp } from '../../../../../../dataModels/get-bank-docType.model';
import { ManageCollectionDocTypeService } from '../../../../../../providers/services/main-module-services/bank-module-services/get-bank-doc-type.service';
import { HttpClient } from '@angular/common/http';
import { ApiRouter, Lob, StatusCode } from '../../../../../../common/enums/enums';
import { UploadDocumentReq } from '../../../../../../dataModels/upload-document.model';
import { ManageCollectionPensionResp } from '../../../../../../dataModels/manageCollection-pension.model';
import { UploadDocumentService } from '../../../../../../providers/services/main-module-services/upload-doc.service';

@IonicPage()
@Component({
    selector: "page-add-nominee",
    templateUrl: "add-nominee.html"
})
export class AddNomineePage {

    addNomineeForm: FormGroup;
    submitAttempt: boolean = false;
    headerTitle: string = "";
    beneficiaryMode: string = "";
    showFields: boolean = true;
    countryCodes: CountryCode[] = [];
    docType: DocType[];
    beneficiaryData: Beneficiaries;
    beneficiaryDetails: BeneficiaryAccountResp;
    addNominee: Nominee;
    cpPension: ManageCollectionPensionResp;
    fileEvent: any;
    fileData: FileAttachmentReq;
    selectFile: boolean;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public logonService: LogonService,
        public formBuilder: FormBuilder,
        public alertService: AlertService,
        private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider,
        public countryCodeService: CountryCodeService,
        public manageCpDocTypeService: ManageCollectionDocTypeService,
        private http: HttpClient,
        public uploadDocumentService: UploadDocumentService,
    ) {
        this.validateForm();
        this.addNominee = new Nominee();

        this.beneficiaryMode = this.navParams.get("beneficiaryMode");
        this.beneficiaryData = JSON.parse(JSON.stringify(this.navParams.get("beneficiaryData")));
        this.beneficiaryDetails = this.navParams.get("beneficiaryDetails");
        this.cpPension = this.navParams.get("cpPension");
    }

    validateForm() {
        this.addNomineeForm = this.formBuilder.group({
            firstName: ["", Validators.compose([Validators.required, Validators.pattern(RegexPattern.onlyContainLetters)])],
            lastName: ["", Validators.compose([Validators.required, Validators.pattern(RegexPattern.onlyContainLetters)])],
            gender: ["", Validators.compose([Validators.required])],
            dob: ["", Validators.compose([Validators.required])],
            middleName: ["", Validators.compose([Validators.pattern(RegexPattern.onlyContainLetters)])],
            // email: ["", Validators.compose([Validators.required, Validators.pattern(RegexPattern.email)])],
            mobile: ['', Validators.compose([Validators.required, Validators.pattern(RegexPattern.numStartWithZero), Validators.pattern(RegexPattern.onlyContainNumbers), Validators.minLength(10), Validators.maxLength(10)])],
            nationality: ["", Validators.compose([Validators.required])],
            relation: ["", Validators.compose([Validators.required])],

            documentType: [""],
            documentNumber: [""],
            document: [[], Validators.compose([Validators.required])]
        });
    }

    ionViewDidLoad() {
        console.log("ionViewDidLoad AddNomineePage");
        this.setupPage();
        // this.getDocType();
        this.getCountryCodes();

        // Firebase Analytics 'screen_view' event tracking
        this.customFirebaseAnalytics.trackView('Pension AddNomineePage');
    }

    setupPage() {
        if (this.beneficiaryData.nominee) {
            this.addNominee = this.beneficiaryData.nominee;
            this.addNomineeForm.controls["document"].setValue(this.addNominee.uploadDocuments);
            this.addNomineeForm.controls["document"].updateValueAndValidity();
        }

        if (this.beneficiaryMode == "viewMode") {
            this.headerTitle = "View Nominee";
            this.showFields = false;
        }
        else {
            if (this.beneficiaryMode == "editMode") {
                this.headerTitle = "Edit Nominee";
            }
            else {
                this.headerTitle = "Add Nominee";
            }
        }
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

    browsefileClick(event) {
        console.log('browsefileClick event -> ', event);
        // this.addNominee.uploadDocuments = [];
        if (this.addNominee.uploadDocuments.length > 0) {
            this.addNomineeForm.controls["document"].clearValidators();
            this.addNomineeForm.controls["document"].updateValueAndValidity();
        }
    }

    handleFileUpload(event) {
        console.log('handleFileUpload -> ', event);
        if (event.target.files.length == 0) {
            return;
        }

        // this.addNominee.uploadDocuments = [];
        Utils.readFileInBase64(event).then((data: FileAttachmentReq) => {
            console.log("fileData->", data);
            let kb = (data.fileSize / 1024);
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

        if (!this.addNomineeForm.get('documentType').value || !this.addNomineeForm.get('documentNumber').value) {
            this.addNomineeForm.get('documentType').setValidators([
                Validators.required,
            ]);
            this.addNomineeForm.get('documentNumber').setValidators([
                Validators.required,
                Validators.minLength(8)
            ]);

            this.addNomineeForm.get('documentType').updateValueAndValidity();
            this.addNomineeForm.get('documentNumber').updateValueAndValidity();
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
        req.personType = "nominee" + this.beneficiaryData.index;
        req.transactionType = "updateBeneficiary";
        req.transactionNumber = this.cpPension.request.transactionNumber;
        req.fileBase64String = data.base64File;
        req.filePath = "" //data.filePath;
        req.policyNo = "";
        req.lob = Lob.PENSION;
        req.category = "";
        req.product = this.beneficiaryDetails.productName;
        req.docType = this.addNominee.documentType;

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
            this.addNominee.uploadDocuments.push(data);
            this.addNomineeForm.controls["document"].setValue(this.addNominee.uploadDocuments);
            this.setDocumentType(this.addNominee.documentType);
        },
            (err) => {
                this.resetDocUpload();

                if (err.name === "TimeoutError") {
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
        let documentNumber = this.addNominee.documentNumber;
        switch (documentType) {
          case "Passport":
            this.addNominee.passportNo = documentNumber;
            break;
          case "'Application Form":
            this.addNominee.applicationNo = documentNumber;
            break;
          case "National ID":
            this.addNominee.nationalIdNumber = documentNumber;
            break;
          case "Photo":
            this.addNominee.photoNo = documentNumber;
            break;
          case "Birth Certificate":
            this.addNominee.birthCertificateNumber = documentNumber;
            break;
        
          default:
            break;
        }
      }

    resetDocUpload() {
        if (this.addNominee.uploadDocuments.length == 0) {
            this.addNomineeForm.controls['document'].reset();
        }
    }

    deleteFile(file) {
        let index = this.addNominee.uploadDocuments.indexOf(file);
        if (index > -1) {
            this.addNominee.uploadDocuments.splice(index, 1);
        }
    }

    dobChange(event: AgeFormatInterface) {
        console.log("Date Picker", event);
        let age = Utils.getAge(event);
        if (age < 18) {
            this.addNominee.birthDate = '';
            event = {}
            let msg = "Nominee age must be greater than 18";
            this.alertService.Alert.alert(msg, '', 'OK');
        }
    }

    validateform() {
        this.addNomineeForm.valid ? this.proceedClicked() : this.submitAttempt = true;
    }

    proceedClicked() {
        this.addNominee.lumpsum_entitlement = '100';
        this.addNominee.percentage = '100';
        this.beneficiaryData.nominee = this.addNominee;

        if (this.beneficiaryMode == 'addMode') {
            // this.beneficiaryData.action = BeneficiaryAction.ADD;
            this.beneficiaryDetails.beneficiaries.push(this.beneficiaryData);
        }
        else if (this.beneficiaryMode == 'editMode') {
            // this.beneficiaryData.action = BeneficiaryAction.MODIFY;
            this.beneficiaryDetails.beneficiaries[this.beneficiaryData.index] = this.beneficiaryData;
        }

        console.log("beneficiaryData =>" + JSON.stringify(this.beneficiaryData));
        console.log("beneficiaryDetails =>" + JSON.stringify(this.beneficiaryDetails));
        console.log("addNominee =>" + JSON.stringify(this.addNominee));

        this.navCtrl.push(ModifyBeneficiaryPage, {
            "beneficiaryDetails": this.beneficiaryDetails,
            "copyBeneficiaryDetails": this.navParams.get("copyBeneficiaryDetails"),
            "cpPension": this.navParams.get("cpPension"),
            "pensionDetailsResp": this.navParams.get("pensionDetailsResp")
        }).then(data => {
            this.navCtrl.remove(1, this.navCtrl.getActive().index - 1);
        });
    }

}
