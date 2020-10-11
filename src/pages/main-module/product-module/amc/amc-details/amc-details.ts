import { LocalStorageKey, Lob, StatusCode } from './../../../../../common/enums/enums';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { LogonService } from '../../../../../providers/services/auth/logon.service';
import { AccountList } from '../../../../../dataModels/account-list.model';
import { AmcAccountDetailsService } from '../../../../../providers/services/main-module-services/product-services/amc-services/amc-tabs/amc-account-details.service';
import { AmcNomineesListService } from '../../../../../providers/services/main-module-services/product-services/amc-services/amc-tabs/amc-nominees-list.service';
import { AmcAccountHoldingsService } from '../../../../../providers/services/main-module-services/product-services/amc-services/amc-tabs/amc-account-holdings.service';
import { AmcClientContactsService } from '../../../../../providers/services/main-module-services/product-services/amc-services/amc-tabs/amc-client-contacts.service';
import { AmcFundTransactionService } from '../../../../../providers/services/main-module-services/product-services/amc-services/amc-tabs/amc-fund-transaction.service';
import { AmcAccountDetailsReq, AmcAccountDetailsResp } from '../../../../../dataModels/amc-account-details.model';
import { AmcAccountHoldingsReq, AmcAccountHoldingsResp } from '../../../../../dataModels/amc-account-holdings.model';
import { AmcFundTransactionReq, AmcFundTransactionResp } from '../../../../../dataModels/amc-fund-transaction.model';
import { AmcNomineesListReq, AmcNomineesListResp } from '../../../../../dataModels/amc-nominees-list.model';
import { AmcClientContactsReq, AmcClientContactsResp } from '../../../../../dataModels/amc-client-contacts.model';
import { ClientDetailsService } from '../../../../../providers/services/main-module-services/product-services/client-details.service';
import { ClientDetailsReq, ClientDetailsResp } from '../../../../../dataModels/client-details.model';
import { CustomFirebaseAnalyticsProvider } from '../../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../../../common/decorators/page-track';
import { AmcClientDetailsService } from '../../../../../providers/services/main-module-services/product-services/amc-services/amc-client-detail.service';

export enum AMCSegment {
  AccountDetails = 'Account Details',
  AcHoldings = 'A/c Holdings',
  AccTransactions = 'A/c Transactions',
  BankDetails = 'Bank Details',
  AccJointHolderDetails = 'Acc Joint Holder Details',
  AcNominee = 'A/c Nominee',
  ClientDetails = 'Client Details',
  ClientContacts = 'Client Contacts',
  FinancialAdvisorDetails = 'Financial Advisor Details'
}
export enum AMCTags {
  AccountDetails = 'AccountDetails',
  AcHoldings = 'AcHoldings',
  AccTransactions = 'AccTransactions',
  BankDetails = 'BankDetails',
  AccJointHolderDetails = 'AccJointHolderDetails',
  AcNominee = 'AcNominee',
  ClientDetails = 'ClientDetails',
  ClientContacts = 'ClientContacts',
  FinancialAdvisorDetails = 'FinancialAdvisorDetails',
}

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-amc-details',
  templateUrl: 'amc-details.html',
})
export class AmcDetailsPage implements OnInit {

  policyData: AccountList;

  amcProduct = {
    segmentList: [
      { name: AMCSegment.AccountDetails, selectedTag: AMCTags.AccountDetails },
      { name: AMCSegment.AcHoldings, selectedTag: AMCTags.AcHoldings },
      { name: AMCSegment.AccTransactions, selectedTag: AMCTags.AccTransactions },
      { name: AMCSegment.BankDetails, selectedTag: AMCTags.BankDetails },
      { name: AMCSegment.AccJointHolderDetails, selectedTag: AMCTags.AccJointHolderDetails },
      { name: AMCSegment.AcNominee, selectedTag: AMCTags.AcNominee },
      { name: AMCSegment.ClientDetails, selectedTag: AMCTags.ClientDetails },
      { name: AMCSegment.ClientContacts, selectedTag: AMCTags.ClientContacts },
      { name: AMCSegment.FinancialAdvisorDetails, selectedTag: AMCTags.FinancialAdvisorDetails },
    ],
    detailObjs: {
      AccountDetails: { name: AMCSegment.AccountDetails, isList: true, detail: [], responseReceived: false },
      AcHoldings: { name: AMCSegment.AcHoldings, isList: false, detail: [], responseReceived: false },
      AccTransactions: { name: AMCSegment.AccTransactions, isList: false, detail: [], responseReceived: false },
      BankDetails: { name: AMCSegment.BankDetails, isList: false, detail: [], responseReceived: false },
      AccJointHolderDetails: { name: AMCSegment.AccJointHolderDetails, isList: false, detail: [], responseReceived: false },
      AcNominee: { name: AMCSegment.AcNominee, isList: false, detail: [], responseReceived: false },
      ClientDetails: { name: AMCSegment.ClientDetails, isList: true, detail: [], responseReceived: false },
      ClientContacts: { name: AMCSegment.ClientContacts, isList: false, detail: [], responseReceived: false },
      FinancialAdvisorDetails: { name: AMCSegment.FinancialAdvisorDetails, isList: true, detail: [], responseReceived: false },
    }
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public logonService: LogonService,
    public amcAccountDetailsService: AmcAccountDetailsService,
    public amcNomineesListService: AmcNomineesListService,
    public amcClientDetailsService: AmcClientDetailsService,
    public amcHoldingsService: AmcAccountHoldingsService,
    public amcClientContactsService: AmcClientContactsService,
    public amcFundTransactionService: AmcFundTransactionService,
    public alertCtrl: AlertController,private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider

  ) {
  }

  ngOnInit(): void {
    this.policyData = this.navParams.get('data');
    this.getAMCAccountDetails();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AmcDetailsPage');

       // Firebase Analytics 'screen_view' event tracking
       this.customFirebaseAnalytics.trackView('AmcDetailsPage');
  }


  // --------------------------- AMC --------------------------- //


  // This function gets AccountDetails, AccJointHolderDetails, FinancialAdvisorDetails data from the 'getAccountDetails' API.
  getAMCAccountDetails() {
    let reqData = new AmcAccountDetailsReq();
    reqData.accountDetailReq.accountNumber = this.policyData.accountNumber;
    reqData.accountDetailReq.formatted = true;

    this.amcAccountDetailsService.getAccountDetails(reqData, (resp: AmcAccountDetailsResp) => {
      if (resp.policyDetails.length > 0) {
        this.amcProduct.detailObjs[AMCTags.AccountDetails].detail = resp.policyDetails;
        this.amcProduct.detailObjs[AMCTags.AccountDetails].responseReceived = true;
      }
      if (resp.jointHoldersDetails.length > 0) {
        this.amcProduct.detailObjs[AMCTags.AccJointHolderDetails].detail = resp.jointHoldersDetails;
        this.amcProduct.detailObjs[AMCTags.AccJointHolderDetails].responseReceived = true;
      }
      if (resp.financialAdvisorDetails.length > 0) {
        this.amcProduct.detailObjs[AMCTags.FinancialAdvisorDetails].detail = resp.financialAdvisorDetails;
        this.amcProduct.detailObjs[AMCTags.FinancialAdvisorDetails].responseReceived = true;
      }
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getAMCAccountDetails();
          }
        })
      });
  }

  getAMCAccountHoldings() {
    let reqData = new AmcAccountHoldingsReq();
    reqData.accountNumber = this.policyData.accountNumber;
    reqData.formatted = true;

    this.amcHoldingsService.getHoldings(reqData, (resp: AmcAccountHoldingsResp) => {
      this.amcProduct.detailObjs[AMCTags.AcHoldings].detail = resp.accountHoldings;
      this.amcProduct.detailObjs[AMCTags.AcHoldings].responseReceived = true;
    },
      (err) => {
        if (err.status == StatusCode.Status403) {
          this.logonService.getToken((isTokenValid: boolean) => {
            if (isTokenValid) {
              this.getAMCAccountHoldings();
            }
          })
        }
      });
  }

  getAMCAccountTransactions(data?) {
    let reqData = new AmcFundTransactionReq();
    reqData.accountNumber = this.policyData.accountNumber;
    reqData.fromDate = new Date(data.fromDate).toUTCString();
    reqData.toDate = new Date(data.toDate).toUTCString();

    this.amcFundTransactionService.getAcTransaction(reqData, (resp: AmcFundTransactionResp) => {
      this.amcProduct.detailObjs[AMCTags.AccTransactions].detail = resp.accountTransactions;
      this.amcProduct.detailObjs[AMCTags.AccTransactions].responseReceived = true;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getAMCAccountTransactions();
          }
        })
      });
  }

  getAMCNomineesList() {
    let reqData = new AmcNomineesListReq();
    reqData.accountNumber = this.policyData.accountNumber;

    this.amcNomineesListService.getAccountNomineesList(reqData, (resp: AmcNomineesListResp) => {
      this.amcProduct.detailObjs[AMCTags.AcNominee].detail = resp.accountNominees;
      this.amcProduct.detailObjs[AMCTags.AcNominee].responseReceived = true;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getAMCNomineesList();
          }
        })
      });
  }

  // This function gets ClientDetails, BankDetails data from the 'getClientDetails' API.
  getClientDetails() {
    let reqData = new ClientDetailsReq();
    reqData.nationalIdNumber = localStorage.getItem(LocalStorageKey.NationalID);
    reqData.lobSrc = Lob.AMC;
    reqData.formatted = true;

    this.amcClientDetailsService.getClientDetails(reqData, (resp: ClientDetailsResp) => {
      if (resp.clientDetails.length > 0) {
        this.amcProduct.detailObjs[AMCTags.ClientDetails].detail = resp.clientDetails;
        this.amcProduct.detailObjs[AMCTags.ClientDetails].responseReceived = true;
      }
      if (resp.bankAccountsDetails.length > 0) {
        this.amcProduct.detailObjs[AMCTags.BankDetails].detail = resp.bankAccountsDetails;
        this.amcProduct.detailObjs[AMCTags.BankDetails].responseReceived = true;
      }
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getClientDetails();
          }
        })
      });
  }

  getAMCClientContacts() {
    let reqData = new AmcClientContactsReq();
    reqData.nationalIdNumber = localStorage.getItem(LocalStorageKey.NationalID);
    reqData.formatted = true

    this.amcClientContactsService.getClientContacts(reqData, (resp: AmcClientContactsResp) => {
      this.amcProduct.detailObjs[AMCTags.ClientContacts].detail = resp.clientContacts;
      this.amcProduct.detailObjs[AMCTags.ClientContacts].responseReceived = true;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getAMCClientContacts();
          }
        })
      });
  }


  // --------------------------- Done --------------------------- //


  accordionOutput(tag: string) {
    if (this.amcProduct.detailObjs[tag].responseReceived && tag != AMCTags.AccTransactions) {
      return;
    }

    if (tag == AMCTags.AccountDetails) {
      this.getAMCAccountDetails();
    }
    else if (tag == AMCTags.AcHoldings) {
      this.getAMCAccountHoldings();
    }
    else if (tag == AMCTags.AccTransactions) {
      this.presentPrompt();
    }
    else if (tag == AMCTags.BankDetails) {
      this.getClientDetails();
    }
    else if (tag == AMCTags.AccJointHolderDetails) {
      this.getAMCAccountDetails();
    }
    else if (tag == AMCTags.AcNominee) {
      this.getAMCNomineesList();
    }
    else if (tag == AMCTags.ClientDetails) {
      this.getClientDetails();
    }
    else if (tag == AMCTags.ClientContacts) {
      this.getAMCClientContacts();
    }
    else if (tag == AMCTags.FinancialAdvisorDetails) {
      this.getAMCAccountDetails();
    }
    else {
      console.log('Selected tag not found ->');
    }
  }


  getSegment(selectedValue: AMCTags) {
    console.log('value: ', selectedValue);
    // this.selectedTag = selectedValue;
  }

  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'A/c Transactions',
      inputs: [
        {
          name: 'fromDate',
          placeholder: 'From Date',
          type: 'date'
        },
        {
          name: 'toDate',
          placeholder: 'To Date',
          type: 'date'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Submit',
          handler: data => {
            console.log(data);
            this.getAMCAccountTransactions(data);
          }
        }
      ]
    });
    alert.present();
  }


}
