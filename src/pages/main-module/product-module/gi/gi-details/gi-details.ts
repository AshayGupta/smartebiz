import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AccountList } from '../../../../../dataModels/account-list.model';
import { GIDetailsService } from '../../../../../providers/services/main-module-services/product-services/gi-services/gi-tabs/gi-details.service';
import { GiAccountDetailsService } from '../../../../../providers/services/main-module-services/product-services/gi-services/gi-tabs/gi-account-details.service';
import { GiAccountDetailsReq, GiAccountDetailsResp } from '../../../../../dataModels/gi-account-details.model';
import { LogonService } from '../../../../../providers/services/auth/logon.service';
import { GIDetailsReq, GIDetailsResp } from '../../../../../dataModels/gi-details.model';
import { CustomFirebaseAnalyticsProvider } from '../../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../../../common/decorators/page-track';

export enum GISegment {
  PolicyDetails = 'Policy Details',
  Covers = 'Covers',
  Claims = 'Claims',
  Invoices = 'Invoices'
}
export enum GITags {
  PolicyDetails = 'PolicyDetails',
  Covers = 'Covers',
  Claims = 'Claims',
  Invoices = 'Invoices',
}

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-gi-details',
  templateUrl: 'gi-details.html',
})
export class GiDetailsPage implements OnInit {

  policyData: AccountList;

  giProduct = {
    segmentList: [
      { name: GISegment.PolicyDetails, selectedTag: GITags.PolicyDetails },
      { name: GISegment.Covers, selectedTag: GITags.Covers },
      { name: GISegment.Claims, selectedTag: GITags.Claims },
      { name: GISegment.Invoices, selectedTag: GITags.Invoices },
    ],
    detailObjs: {
      PolicyDetails: { name: GISegment.PolicyDetails, isList: false, detail: [], responseReceived: false },
      Covers: { name: GISegment.Covers, isList: false, detail: [], responseReceived: false },
      Claims: { name: GISegment.Claims, isList: false, detail: [], responseReceived: false },
      Invoices: { name: GISegment.Invoices, isList: false, detail: [], responseReceived: false },
    }
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public logonService: LogonService,
    public giDetailsService: GIDetailsService,
    public giAccountDetailsService: GiAccountDetailsService,private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider
  ) {
  }

  ngOnInit(): void {
    this.policyData = this.navParams.get('data');
    this.getGIAccountDetails();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GiDetailsPage');

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('GIDetailsPage');
  }


  // --------------------------- GI --------------------------- //

  // This function gets PolicyDetails, Claims data from the 'getAccountDetails' API.
  getGIAccountDetails() {
    let reqData = new GiAccountDetailsReq();
    reqData.accountDetailReq.accountNumber = this.policyData.accountNumber;
    reqData.accountDetailReq.formatted = true;

    this.giAccountDetailsService.getAccountDetails(reqData, (resp: GiAccountDetailsResp) => {
      this.giProduct.detailObjs[GITags.PolicyDetails].detail = resp.policyDetails;
      this.giProduct.detailObjs[GITags.PolicyDetails].responseReceived = true;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getGIAccountDetails();
          }
        })
      });
  }

  // This function gets Covers, Invoices data from the 'getDetails' API.
  getGIDetails() {
    let reqData = new GIDetailsReq();
    // reqData.accountReference = 
    reqData.formatted = true;

    this.giDetailsService.getDetails(reqData, (resp: GIDetailsResp) => {
      if (resp.covers.length > 0) {
        this.giProduct.detailObjs[GITags.Covers].detail = resp.covers;
        this.giProduct.detailObjs[GITags.Covers].responseReceived = true;
      }
      if (resp.invoices.length > 0) {
        this.giProduct.detailObjs[GITags.Invoices].detail = resp.invoices;
        this.giProduct.detailObjs[GITags.Invoices].responseReceived = true;
      }
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getGIDetails();
          }
        })
      });
  }


  // --------------------------- Done --------------------------- //

  accordionOutput(tag: string) {
    if (this.giProduct.detailObjs[tag].responseReceived) {
      return;
    }

    if (tag == GITags.PolicyDetails) {
      this.getGIAccountDetails();
    }
    else if (tag == GITags.Covers) {
      this.getGIDetails();
    }
    else if (tag == GITags.Claims) {
      this.getGIAccountDetails();
    }
    else if (tag == GITags.Invoices) {
      this.getGIDetails();
    }
    else {
      console.log('Selected tag not found ->');
    }
  }


  getSegment(selectedValue: GITags) {
    console.log('value: ', selectedValue);
    // this.selectedTag = selectedValue;
  }

}
