import { ManageCollectionDocTypeService } from './../../../../../providers/services/main-module-services/bank-module-services/get-bank-doc-type.service';
import { FileAttachmentReq } from './../../../../../dataModels/file-attachment.model';
import { Utils } from './../../../../../common/utils/utils';
import { BankBranchListService } from '../../../../../providers/services/main-module-services/bank-module-services/get-bank-branch-list.service';
import { BankListService } from '../../../../../providers/services/main-module-services/bank-module-services/get-bank-list.service';
import { BranchList, BranchListReq, BranchListResp } from './../../../../../dataModels/get-bank-branch-list.model';
import { BankList, BankListReq, BankListResp } from './../../../../../dataModels/get-bank-list.model';
import { RegexPattern, ApiUrl } from './../../../../../common/constants/constants';
import { BankDetail, BuyProductReq } from './../../../../../dataModels/buy-product-model';
import { PasswordValidator } from './../../../../../common/validators/password.validator';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InvestmentAmountPage } from './../investment-amount/investment-amount';
import { LogonService } from './../../../../../providers/services/auth/logon.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ManageCollectionDocTypeResp, DocType } from '../../../../../dataModels/get-bank-docType.model';
import { GetTransactionNumberReq, GetTransactionNumberResp } from '../../../../../dataModels/get-transaction-number.model';
import { GetTransactionNumberService } from '../../../../../providers/services/main-module-services/buy-product-module-services/get-transaction-number.service';
import { UploadDocumentService } from '../../../../../providers/services/main-module-services/upload-doc.service';
import { UploadDocumentReq } from '../../../../../dataModels/upload-document.model';
import { AmcMongoStagesReq } from '../../../../../dataModels/amc-mongo-stages.model';
import { AmcMongoStagesService } from '../../../../../providers/services/main-module-services/buy-product-module-services/amc-mongo-stages.service';
import { MongoAMCStaging, StatusCode, ApiRouter } from '../../../../../common/enums/enums';
import { AlertService } from '../../../../../providers/plugin-services/alert.service';
import { FileTransferService } from '../../../../../providers/plugin-services/file-transfer.service';
import { ChooseFileService } from '../../../../../providers/plugin-services/choose-file.service';
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-bank-details',
  templateUrl: 'bank-details.html'
})
export class BankDetailsPage {

  bankDetailForm: FormGroup;
  submitAttempt: boolean = false;
  headerTitle: string = 'Bank Details';
  buyProductReq: BuyProductReq;

  bankList: BankList[] = [];
  branchList: BranchList[] = [];
  bankDetail: BankDetail = new BankDetail();
  docType: DocType[];
  onboardingMongoReq = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public logonService: LogonService,
    public bankListService: BankListService,
    public branchListService: BankBranchListService,
    public manageCpDocTypeService: ManageCollectionDocTypeService,
    public getTransactionNumberService: GetTransactionNumberService,
    public uploadDocumentService: UploadDocumentService,
    private amcMongoStagesService: AmcMongoStagesService,
    private alertService: AlertService,
    private fileTransferService: FileTransferService,
    private chooseFileService: ChooseFileService,
    private http: HttpClient,
  ) {
    this.buyProductReq = this.navParams.get("buyProductReq");
    this.onboardingMongoReq = this.navParams.get('amcMongoReq');
    console.log('BankDetailsPage buyProductReq ->', this.buyProductReq);

    this.validateForm();
  }

  validateForm() {
    this.bankDetailForm = this.formBuilder.group({
      bankName: ['', Validators.compose([Validators.required])],
      bankBranch: ['', Validators.compose([Validators.required])],
      accountNumber: ['', Validators.compose([Validators.required, Validators.pattern(RegexPattern.onlyContainNumbers)])],
      verifyAccountNumber: ['', Validators.compose([Validators.required, PasswordValidator.Match("accountNumber", "verifyAccountNo"), Validators.pattern(RegexPattern.onlyContainNumbers)])],
      accountHolderName: ['', Validators.compose([Validators.required, Validators.pattern(RegexPattern.onlyContainLetters)])],
      documentType: ['', Validators.compose([Validators.required])],
      // documentNumber:['',Validators.compose([Validators.required,Validators.pattern(RegexPattern.onlyContainNumbers)])],
      document: [this.bankDetail.documents, Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BankDetailsPage');
    this.buyProductReq.bankFileAttach = new FileAttachmentReq();
    this.getBankList();
    this.getDocType();
    this.getTransactionNumber().then((tranNum: string) => {
      this.bankDetail.transactionNumber = tranNum;
    });
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

  getBankList() {
    let req = new BankListReq();
    req.lobSrc = this.buyProductReq.lobSrc;
    req.countryCode = "KE" //this.buyProductReq.personalDetail.countryCode;

    this.bankListService.getBankList(req, (resp: BankListResp) => {
      this.bankList = resp.bankList;
      this.bankList.sort((a, b) => { return a.bankName < b.bankName ? -1 : 1 });
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getBankList();
          }
        })
      });
  }

  selectBank(bankCode: string) {
    this.bankList.filter(data => {
      if (bankCode == data.bankCode) {
        this.bankDetail.bankName = data.bankName;
      }
    });

    let req = new BranchListReq();
    req.lobSrc = this.buyProductReq.lobSrc;
    req.countryCode = "KE" //this.buyProductReq.personalDetail.countryCode;
    req.bankCode = bankCode;

    this.branchListService.getBranchList(req, (resp: BranchListResp) => {
      this.branchList = resp.branchList;
      this.branchList.sort((a, b) => { return a.branchName < b.branchName ? -1 : 1 });
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.selectBank(bankCode);
          }
        })
      });
  }

  uploadfileClick(event) {
    console.log('uploadfileClick event -> ', event);
    console.log('this.bankDetailForm', JSON.stringify(this.bankDetailForm.controls["document"].value));
    if (this.bankDetail.documents.length > 0) {
      this.bankDetailForm.controls["document"].clearValidators();
      this.bankDetailForm.controls["document"].updateValueAndValidity();
    }
  }

  handleFileUpload(event) {
    if (event.target.files.length == 0) {
      return;
    }

    if (!this.bankDetail.transactionNumber) {
      this.getTransactionNumber().then((tranNum: string) => {
        this.bankDetail.transactionNumber = tranNum;
        this.getFile(event);
      });
    }
    else {
      this.getFile(event);
    }
  }

  getFile(event) {
    console.log(event);
    // this.bankDetail.documents = [];
    Utils.readFileInBase64(event).then((data: FileAttachmentReq) => {
      console.log("fileData->", data);
      // this.bankDetail.documents.filter(file => {
      //   if (data.fileName === file.fileName) {
      //     file.copyCount += 1;
      //     data.fileName = data.fileName + "(" + file.copyCount + ")";
      //   }
      // });
      // this.bankDetail.documents.push(data);
      let kb = (data.fileSize / 1024);
      console.log('kb -> ', kb);

      if (kb <= 5120) {
        const formData = new FormData();
        formData.append('file', event.target.files[0]);
        
        this.http.post<any>(ApiUrl.baseUrl + ApiRouter.ApiRouter2 + '/lfr/cust/upload/fileUpload', formData).subscribe(
          (res) => {
            console.log('FormData ->', res);
            // data.filePath = res.data.fileUrl;
            data.base64File = JSON.stringify(res.data);
            this.uploadDocument(data);
          },
          (err) => {
            console.log(err);
            this.alertService.Alert.alert("Error in uploading file");
          }
        );
      }
      else {
        this.alertService.Alert.alert("File size limit is 5 MB");
      }
    });
  }


  uploadDocument(data: FileAttachmentReq) {
    let req = new UploadDocumentReq();
    req.folderName = "Mobile Document";
    req.fileName = data.fileName;
    req.mimeType = data.fileExtension;
    req.idType = this.buyProductReq.userDetails.idType;
    req.idValue = this.buyProductReq.userDetails.idValue;
    req.personType = "";
    req.transactionType = "onboarding";
    req.transactionNumber = this.bankDetail.transactionNumber;
    req.fileBase64String = data.base64File;
    req.filePath = ""//data.filePath;
    req.policyNo = "";
    req.lob = this.buyProductReq.lobSrc;
    req.category = "";
    req.product = this.buyProductReq.investment.selectedFund.productCode;
    req.docType = "BankProof";

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

      this.buyProductReq.bankFileAttach = data;
      this.bankDetail.documents = [];
      this.bankDetail.documents.push(document);
      this.bankDetailForm.controls["document"].setValue(this.bankDetail.documents);
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

  resetDocUpload() {
    if (this.bankDetail.documents.length == 0) {
      this.bankDetailForm.controls['document'].reset();
    }
  }

  getTransactionNumber() {
    return new Promise((resolve, reject) => {
      let req = new GetTransactionNumberReq();
      req.transactionType = "onbording";
      req.policyNumber = this.buyProductReq.investment.selectedFund.productCode

      this.getTransactionNumberService.getTransactionNumber(req, (resp: GetTransactionNumberResp) => {
        resolve(resp.transactionNumber);
      })
    });
  }

  proceedClicked() {
    this.setStagesInMongo(MongoAMCStaging.Done);

    this.buyProductReq.bankDetail = this.bankDetail;
    console.log('buyProductReq ->', this.buyProductReq);
    this.navCtrl.push(InvestmentAmountPage, {
      'buyProductReq': this.buyProductReq,
      'amcMongoReq': this.onboardingMongoReq
    });
  }

  setStagesInMongo(status: string) {
    this.onboardingMongoReq["stages"].filter(item => {
      if (item.name == "addBankDetails") {
        item.status = status;
      }
    });
    this.onboardingMongoReq["addBankDetails"] = this.bankDetail;

    this.amcMongoStagesService.updateAmcMongoStage(this.onboardingMongoReq, (resp) => {
    });
  }

}
