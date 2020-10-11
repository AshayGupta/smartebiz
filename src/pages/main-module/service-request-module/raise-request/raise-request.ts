import { FileAttachmentReq } from './../../../../dataModels/file-attachment.model';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LogonService } from '../../../../providers/services/auth/logon.service';
import { RaiseServiceRequestReq } from '../../../../dataModels/raise-service-request.model';
import { LocalStorageKey } from '../../../../common/enums/enums';
import { CategoryMatrixService } from '../../../../providers/services/main-module-services/service-request-services/get-category-matrix.service';
import { CategoryMatrixReq, CategoryMatrixResp, CategoryMatrix } from './../../../../dataModels/category-matrix.model';
import { AccountList } from '../../../../dataModels/account-list.model';
import { GetAllAccountsService } from './../../../../providers/services/main-module-services/product-services/all-accounts.service';
import { AllAccountsReq, AllAccountsResp } from './../../../../dataModels/all-accounts.model';
import { Utils } from './../../../../common/utils/utils';
import { RaiseRequestConfirmPage } from '../raise-request-confirm/raise-request-confirm';
import { CustomFirebaseAnalyticsProvider } from '../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../../common/decorators/page-track';
import { ClientDetailsReq, ClientDetailsResp } from '../../../../dataModels/client-details.model';
import { ClientDetailsService } from '../../../../providers/services/main-module-services/product-services/client-details.service';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-raise-request',
  templateUrl: 'raise-request.html',
})
export class RaiseRequestPage {

  raiseRequestForm: FormGroup;
  submitAttempt: boolean = false;
  policyData: AccountList;
  accountsList: AccountList[] = [];
  categoryMatrix: CategoryMatrix[] = [];
  lob: string = '';
  raiseServiceReq = new RaiseServiceRequestReq();
  headerTitle: string = 'Raise Request';
  @ViewChild('input_file') input_file: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public logonService: LogonService,
    public formBuilder: FormBuilder,
    public categoryMatrixService: CategoryMatrixService,
    public getAllAccountsService: GetAllAccountsService,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider,
    public clientDetailsService: ClientDetailsService,
  ) {
    this.validateForm();
    this.policyData = this.navParams.get('policyData');
  }

  validateForm() {
    this.raiseRequestForm = this.formBuilder.group({
      policyNo: ['', Validators.compose([Validators.required])],
      category: ['', Validators.compose([Validators.required])],
      // subCategory: ['', Validators.compose([Validators.required])],
      message: ['', Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RaiseRequestPage');
    this.setupPage(); 

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('RaiseRequestPage');
  }

  setupPage() {
    this.raiseServiceReq.autoIncID = 'C' + Utils.autoIncID();
    this.raiseServiceReq.commMethod = 'Customer';
    this.raiseServiceReq.userDetails.idValue = localStorage.getItem(LocalStorageKey.NationalID);
    this.raiseServiceReq.userDetails.idType = localStorage.getItem(LocalStorageKey.NationalIDType);

    if (this.policyData) {
      this.accountsList.push(this.policyData);
      this.raiseServiceReq.policyNo = this.accountsList[0].accountNumber;
      this.selectPolicyNo(this.raiseServiceReq.policyNo);
    }
    else {
      this.getAllAccounts();
    }
  }

  getAllAccounts() {
    let req = new AllAccountsReq();
    req.nationalID = localStorage.getItem(LocalStorageKey.NationalID);
    req.lobSrc = '';

    this.getAllAccountsService.getAllAccounts(req, (resp: AllAccountsResp) => {
      this.accountsList = resp.allAccountsList;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getAllAccounts();
          }
        })
      });
  }

  selectPolicyNo(accountNumber: string) {
    this.accountsList.filter(data => {
      if (accountNumber == data.accountNumber) {
        this.getCategoryData(data.lobSrc);
      }
    })
  }

  getCategoryData(lob: string) {
    this.raiseServiceReq.category = undefined;
    this.raiseServiceReq.subCategory = '';
    this.categoryMatrix = [];

    let req = new CategoryMatrixReq();
    req.lob = lob.toLowerCase() == 'life' ? 'Individual Life' :
              lob.toLowerCase() == 'gi' ? 'General' :
              lob.toLowerCase() == 'asset' ? 'UTF/WMF/DISCRET' :
              lob.toLowerCase() == 'pension' ? 'Retail Pension' :
              '';
    req.action = 'general';

    if(lob.toLowerCase() == 'pension') {
      this.getClientDetails();
    }

    this.categoryMatrixService.getCategoryMatrixData(req, (resp: CategoryMatrixResp) => {
      this.categoryMatrix = resp.categoryMatrix;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getCategoryData(this.lob);
          }
        })
      });
  }

  selectCategory(type: CategoryMatrix) {
    this.raiseServiceReq.subCategory = type.subCategory;
  }

  submitClicked() {
    console.log(this.raiseServiceReq);
    console.log('file attachment ->', this.raiseServiceReq.fileAttachment);
    this.navCtrl.push(RaiseRequestConfirmPage, { 'raiseReqData': this.raiseServiceReq });
  }

  handleFileUpload(event) {
    if (!event.target.files[0]) return;
    Utils.readFileInBase64(event).then((data: FileAttachmentReq) => {
      console.log('fileData->', data);
      this.raiseServiceReq.fileAttachment.filter(file => {
        if (data.fileName === file.fileName) {
          file.copyCount += 1;
          data.fileName = data.fileName + '(' + file.copyCount + ')';
        }
      })
      this.raiseServiceReq.fileAttachment.push(data);
    });
  }

  deleteFile(file: FileAttachmentReq) {
    let index = this.raiseServiceReq.fileAttachment.indexOf(file);
    if (index > -1) {
      this.raiseServiceReq.fileAttachment.splice(index, 1);
    }
  }

  getClientDetails() {
    let reqData = new ClientDetailsReq();
    reqData.nationalIdNumber = this.raiseServiceReq.userDetails.idValue;
    reqData.lobSrc = ''; // dynamic from category basis

    this.clientDetailsService.getClientDetails(reqData, (resp: ClientDetailsResp) => {
      this.raiseServiceReq.contactId = resp.contactId;
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