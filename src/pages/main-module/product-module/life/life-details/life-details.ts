import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AccountList } from '../../../../../dataModels/account-list.model';
import { LifeAccountDetailsReq, LifeAccountDetailsResp } from '../../../../../dataModels/life-account-details.model';
import { LifeAccountBonusesReq, LifeAccountBonusesResp } from '../../../../../dataModels/life-account-bonuses.model';
import { LifePremiumDetailsReq, LifePremiumDetailsResp } from '../../../../../dataModels/life-premium-details.model';
import { LifePayoutScheduleReq, LifePayoutScheduleResp } from '../../../../../dataModels/life-payout-schedule.model';
import { LifeAccountRelationsReq, LifeAccountRelationsResp } from '../../../../../dataModels/life-account-relations.model';
import { LifePolicyBenefitsReq, LifePolicyBenefitsResp } from '../../../../../dataModels/life-policy-benefits.model';
import { LifeAccountDetailsService } from '../../../../../providers/services/main-module-services/product-services/life-services/life-tabs/life-account-details.service';
import { LifeAccountBonusesService } from '../../../../../providers/services/main-module-services/product-services/life-services/life-tabs/life-account-bonuses.service';
import { LifePremiumDetailsService } from '../../../../../providers/services/main-module-services/product-services/life-services/life-tabs/life-premium-details.service';
import { LifeAccountRelationsService } from '../../../../../providers/services/main-module-services/product-services/life-services/life-tabs/life-account-relations.service';
import { LifePolicyBenefitsService } from '../../../../../providers/services/main-module-services/product-services/life-services/life-tabs/life-policy-benefits.service';
import { LifePayoutScheduleService } from '../../../../../providers/services/main-module-services/product-services/life-services/life-tabs/life-payout-schedule.service';
import { LogonService } from '../../../../../providers/services/auth/logon.service';
import { AccountDetails } from '../../../../../dataModels/account-details.model';
import { CustomFirebaseAnalyticsProvider } from '../../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { PageTrack } from '../../../../../common/decorators/page-track';

export enum LifeSegment {
  PolicyDetails = 'Policy Details',
  BonusPayments = 'Bonus Payments',
  PremiumDetails = 'Premium Details',
  PayoutSchedule = 'Payout Schedule',
  RelationshipDetails = 'Relationship Details',
  PolicyBenefits = 'Policy Benefits'
}
export enum LifeTags {
  PolicyDetails = 'PolicyDetails',
  BonusPayments = 'BonusPayments',
  PremiumDetails = 'PremiumDetails',
  PayoutSchedule = 'PayoutSchedule',
  RelationshipDetails = 'RelationshipDetails',
  PolicyBenefits = 'PolicyBenefits'
}

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-life-details',
  templateUrl: 'life-details.html',
})
export class LifeDetailsPage implements OnInit {

  policyData: AccountList;

  lifeProduct = {
    segmentList: [
      { name: LifeSegment.PolicyDetails, selectedTag: LifeTags.PolicyDetails },
      { name: LifeSegment.BonusPayments, selectedTag: LifeTags.BonusPayments },
      { name: LifeSegment.PremiumDetails, selectedTag: LifeTags.PremiumDetails },
      { name: LifeSegment.PayoutSchedule, selectedTag: LifeTags.PayoutSchedule },
      { name: LifeSegment.RelationshipDetails, selectedTag: LifeTags.RelationshipDetails },
      { name: LifeSegment.PolicyBenefits, selectedTag: LifeTags.PolicyBenefits },
    ],
    detailObjs: {
      PolicyDetails: { name: LifeSegment.PolicyDetails, isList: true, detail: [], responseReceived: false },
      BonusPayments: { name: LifeSegment.BonusPayments, isList: false, detail: [], responseReceived: false },
      PremiumDetails: { name: LifeSegment.PremiumDetails, isList: false, detail: [], responseReceived: false },
      PayoutSchedule: { name: LifeSegment.PayoutSchedule, isList: false, detail: [], responseReceived: false },
      RelationshipDetails: { name: LifeSegment.RelationshipDetails, isList: false, detail: [], responseReceived: false },
      PolicyBenefits: { name: LifeSegment.PolicyBenefits, isList: false, detail: [], responseReceived: false },
    }
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public logonService: LogonService,
    public lifeAccountDetailsService: LifeAccountDetailsService,
    public lifeBonusesService: LifeAccountBonusesService,
    public lifePremiumDetailsService: LifePremiumDetailsService,
    public lifeAccountRelationsService: LifeAccountRelationsService,
    public lifePolicyBenefitsService: LifePolicyBenefitsService,
    public lifePayoutScheduleService: LifePayoutScheduleService,
    private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider
  ) {
  } 

  ngOnInit(): void {
    this.policyData = this.navParams.get('data');
    this.getLifePolicyDetails();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LifeDetailsPage');

    // Firebase Analytics 'screen_view' event tracking
    this.customFirebaseAnalytics.trackView('LifeDetailsPage');
  }


  // --------------------------- LIFE --------------------------- //

  getLifePolicyDetails() {
    let reqData = new LifeAccountDetailsReq();
    reqData.accountDetailReq.accountNumber = this.policyData.accountNumber;
    reqData.accountDetailReq.formatted = true;

    this.lifeAccountDetailsService.getAccountDetails(reqData, (resp: LifeAccountDetailsResp) => {
      this.lifeProduct.detailObjs[LifeTags.PolicyDetails].detail = resp.accountDetails;
      this.lifeProduct.detailObjs[LifeTags.PolicyDetails].responseReceived = true;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getLifePolicyDetails();
          }
        })
      });
  }

  getLifeBonusPayments() {
    let reqData = new LifeAccountBonusesReq();
    reqData.accountNumber = this.policyData.accountNumber;

    this.lifeBonusesService.getBonusPayments(reqData, (resp: LifeAccountBonusesResp) => {
      this.lifeProduct.detailObjs[LifeTags.BonusPayments].detail = resp.accountBonuses;
      this.lifeProduct.detailObjs[LifeTags.BonusPayments].responseReceived = true;

    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getLifeBonusPayments();
          }
        })
      });
  }

  getLifePremiumDetails() {
    let reqData = new LifePremiumDetailsReq();
    reqData.accountNumber = this.policyData.accountNumber;

    this.lifePremiumDetailsService.getPremiumDetails(reqData, (resp: LifePremiumDetailsResp) => {
      this.lifeProduct.detailObjs[LifeTags.PremiumDetails].detail = resp.accountPremiumDetails;
      this.lifeProduct.detailObjs[LifeTags.PremiumDetails].responseReceived = true;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getLifePremiumDetails();
          }
        })
      });
  }

  getLifePayoutSchedule() {
    let reqData = new LifePayoutScheduleReq();
    reqData.planNumber = this.getPolicyDetailObj('planNumber');
    reqData.startDate = this.getPolicyDetailObj('startDate');
    reqData.sumAssured = this.getPolicyDetailObj('sumAssured');
    reqData.term = this.getPolicyDetailObj('term');

    this.lifePayoutScheduleService.getPayoutSchedule(reqData, (resp: LifePayoutScheduleResp) => {
      this.lifeProduct.detailObjs[LifeTags.PayoutSchedule].detail = resp.payoutSchedule;
      this.lifeProduct.detailObjs[LifeTags.PayoutSchedule].responseReceived = true;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getLifeRelationshipDetails();
          }
        })
      });
  }

  getLifeRelationshipDetails() {
    let reqData = new LifeAccountRelationsReq();
    reqData.accountNumber = this.policyData.accountNumber;

    this.lifeAccountRelationsService.getAccountRelations(reqData, (resp: LifeAccountRelationsResp) => {
      this.lifeProduct.detailObjs[LifeTags.RelationshipDetails].detail = resp.accountRelations;
      this.lifeProduct.detailObjs[LifeTags.RelationshipDetails].responseReceived = true;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getLifeRelationshipDetails();
          }
        })
      });
  }

  getLifePolicyBenefits() {
    let reqData = new LifePolicyBenefitsReq();
    reqData.accountNumber = this.policyData.accountNumber;

    this.lifePolicyBenefitsService.getPolicyBenefits(reqData, (resp: LifePolicyBenefitsResp) => {
      this.lifeProduct.detailObjs[LifeTags.PolicyBenefits].detail = resp.policyBenefits;
      this.lifeProduct.detailObjs[LifeTags.PolicyBenefits].responseReceived = true;
    },
      (err: boolean) => {
        this.logonService.getToken((isTokenValid: boolean) => {
          if (isTokenValid) {
            this.getLifePolicyBenefits();
          }
        })
      });
  }


  // --------------------------- Done --------------------------- //

  // Get planNumber, term, sumAssured, startDate from the 'getLifeAccountDetails' Api for PayoutSchedule request
  getPolicyDetailObj(keyName: string): string {
    let value = ''
    this.lifeProduct.detailObjs[LifeTags.PolicyDetails].detail.forEach((item: AccountDetails) => {
      if (item.elementName == keyName) {
        value = item.value;
      }
    });

    return value;
  }

  accordionOutput(tag: string) {
    if (this.lifeProduct.detailObjs[tag].responseReceived) {
      return;
    }

    if (tag == LifeTags.PolicyDetails) {
      this.getLifePolicyDetails();
    }
    else if (tag == LifeTags.BonusPayments) {
      this.getLifeBonusPayments();
    }
    else if (tag == LifeTags.PremiumDetails) {
      this.getLifePremiumDetails();
    }
    else if (tag == LifeTags.PayoutSchedule) {
      this.getLifePayoutSchedule();
    }
    else if (tag == LifeTags.RelationshipDetails) {
      this.getLifeRelationshipDetails();
    }
    else if (tag == LifeTags.PolicyBenefits) {
      this.getLifePolicyBenefits();
    }
    else {
      console.log('Selected tag not found ->');
    }
  }


  getSegment(selectedValue: LifeTags) {
    console.log('value: ', selectedValue);
    // this.selectedTag = selectedValue;
  }

}
