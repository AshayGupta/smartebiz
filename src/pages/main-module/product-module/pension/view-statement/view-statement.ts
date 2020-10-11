import { Utils } from './../../../../../common/utils/utils';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AccountList } from '../../../../../dataModels/account-list.model';
import { LogonService } from '../../../../../providers/services/auth/logon.service';
import { CustomFirebaseAnalyticsProvider } from '../../../../../providers/custom-firebase-analytics/custom-firebase-analytics';
import { GetStOpenBalanceService } from '../../../../../providers/services/main-module-services/product-services/pension-services/pension-details/get-stOpen-balance.service';
import { GetStContributionsService } from '../../../../../providers/services/main-module-services/product-services/pension-services/pension-details/get-stContributions.service';
import { GetStClosingBalanceService } from '../../../../../providers/services/main-module-services/product-services/pension-services/pension-details/get-stClosing-balance.service';
import { GetStBenefitPaymentsService } from '../../../../../providers/services/main-module-services/product-services/pension-services/pension-details/get-stBenefit-payments.service';
import { GetPensionAccountDetailsService } from '../../../../../providers/services/main-module-services/product-services/pension-services/pension-details/get-pension-account-details.service';
import { GetInvestmentIncomeService } from '../../../../../providers/services/main-module-services/product-services/pension-services/pension-details/get-investment-income.service';
import { PensionAccountDetailsReq, PensionAccountDetailsResp, PensionDetailsObj } from '../../../../../dataModels/pension-account-details.model';
import { Lob, LocalStorageKey } from '../../../../../common/enums/enums';
import { OpeningBalanceReq, OpeningBalanceResp } from '../../../../../dataModels/getStOpeningBalance.model';
import { ContributionsReq, ContributionsResp } from '../../../../../dataModels/getStContributions.model';
import { BenefitPaymentsReq, BenefitPaymentsResp } from '../../../../../dataModels/getStBenefitPayments.model';
import { InvestmentIncomeReq, InvestmentIncomeResp } from '../../../../../dataModels/getStInvestmentIncome.model';
import { ClosingBalanceReq, ClosingBalanceResp } from '../../../../../dataModels/getStClosingBalance.model';
import * as _ from 'lodash';
import { PageSegmentInterface } from '../../../../../common/interfaces/page-segment.interface';
import { ApiUrl, Environment } from '../../../../../common/constants/constants';

export enum PensionSegment {
    PersonalInformation = 'Personal Information',
    OpeningBalance = 'Opening Balance',
    MonthlyContribution = 'Monthly Contribution',
    BenefitPayments = 'Benefit Payments',
    InvestmentIncome = 'Investment Income',
    ClosingBalance = 'Closing Balance',
}
export enum PensionTags {
    PersonalInformation = 'PersonalInformation',
    OpeningBalance = 'OpeningBalance',
    MonthlyContribution = 'MonthlyContribution',
    BenefitPayments = 'BenefitPayments',
    InvestmentIncome = 'InvestmentIncome',
    ClosingBalance = 'ClosingBalance',
}

export interface DoubleRowInterface {
    date?: string,
    account?: string,
    register?: string,
    unregister?: string,
    total?: string,
    employee?: string,
    employer?: string,
    className?: string
}

@IonicPage()
@Component({
    selector: 'page-view-statement',
    templateUrl: 'view-statement.html',
})
export class ViewStatementPage {

    headerTitle: string = 'My Products';
    policyData: AccountList;
    segmentInput: PageSegmentInterface[] = [];
    detailObj = {};
    pensionDetailsResp: PensionAccountDetailsResp;
    selectedTag: string;
    yearArray: string[] = [];
    selectedYr: string;
    downloadUrl: string;
    closingBalDate: string;
    nationalId: string;

    pensionProduct = {
        segmentList: [
            { name: PensionSegment.PersonalInformation, selectedTag: PensionTags.PersonalInformation, infoTxt: 'Customer personal information' },
            { name: PensionSegment.OpeningBalance, selectedTag: PensionTags.OpeningBalance, infoTxt: 'Amount in the account at the beginning of the period' },
            { name: PensionSegment.MonthlyContribution, selectedTag: PensionTags.MonthlyContribution, infoTxt: 'Amount deposited into account' },
            { name: PensionSegment.BenefitPayments, selectedTag: PensionTags.BenefitPayments, infoTxt: 'Amount withdrawan' },
            { name: PensionSegment.InvestmentIncome, selectedTag: PensionTags.InvestmentIncome, infoTxt: 'Interest earned' },
            { name: PensionSegment.ClosingBalance, selectedTag: PensionTags.ClosingBalance, infoTxt: 'Amount remaining in the account at the end of the period' },
        ],
        detailObjs: {
            PersonalInformation: { name: PensionSegment.PersonalInformation, isList: true, doubleRowHeader: {}, detail: [], responseReceived: false },
            OpeningBalance: { name: PensionSegment.OpeningBalance, isDoubleRow: true, doubleRowHeader: {}, detail: { tableData: [], sum: 0.0 }, responseReceived: false },
            MonthlyContribution: { name: PensionSegment.MonthlyContribution, doubleRowHeader: {}, isDoubleRow: true, detail: { tableData: [], sum: 0.0  }, responseReceived: false },
            BenefitPayments: { name: PensionSegment.BenefitPayments, doubleRowHeader: {}, isDoubleRow: true, detail: { tableData: [], sum: 0.0  }, responseReceived: false },
            InvestmentIncome: { name: PensionSegment.InvestmentIncome, doubleRowHeader: {}, isDoubleRow: true, detail: { tableData: [], sum: 0.0  }, responseReceived: false },
            ClosingBalance: { name: PensionSegment.ClosingBalance, doubleRowHeader: {}, isDoubleRow: true, detail: { tableData: [], sum: 0.0 }, responseReceived: true },
        }
    }

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public logonService: LogonService,
        public alertCtrl: AlertController,
        private customFirebaseAnalytics: CustomFirebaseAnalyticsProvider,
        public getPensionAccDetailsService: GetPensionAccountDetailsService,
        public getInvestmentIncomeService: GetInvestmentIncomeService,
        public getStBenefitPaymentsService: GetStBenefitPaymentsService,
        public getStClosingBalanceService: GetStClosingBalanceService,
        public getStContributionsService: GetStContributionsService,
        public getStOpenBalanceService: GetStOpenBalanceService,
        private iab: InAppBrowser,
    ) {
        this.pensionDetailsResp = new PensionAccountDetailsResp();
        this.pensionDetailsResp.pensionDetailsObj = new PensionDetailsObj();
        this.nationalId = localStorage.getItem(LocalStorageKey.NationalID);
    }

    ngOnInit(): void {
        this.policyData = this.navParams.get('policyData');

        this.segmentInput = <any>this.pensionProduct.segmentList;
        this.detailObj = this.pensionProduct.detailObjs;
        this.selectedTag = this.segmentInput[0].selectedTag;

        this.yearArray = this.getYears();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ViewStatementPage');

        // Firebase Analytics 'screen_view' event tracking
        this.customFirebaseAnalytics.trackView('PensionDetailsPage');
        this.setupPage();
    }

    setupPage() {
        this.getPensionPolicyDetails();
        this.getOpeningBalance();
        this.getMonthlyContribution();
        this.getBenefitPayments();
        // this.getInvestmentIncome();
        this.getClosingBalance();                 
    }

    // 1.
    getPensionPolicyDetails() {
        let reqData = new PensionAccountDetailsReq();
        reqData.accountDetailReq.accountNumber = this.policyData.accountNumber;
        reqData.accountDetailReq.lobSrc = Lob.PENSION;
        reqData.accountDetailReq.formatted = false;

        this.getPensionAccDetailsService.getAccountDetails(reqData, (resp: PensionAccountDetailsResp) => {
            // this.pensionProduct.detailObjs[PensionTags.PersonalInformation].detail = resp.accountDetails;
            // this.pensionProduct.detailObjs[PensionTags.PersonalInformation].responseReceived = true;
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

    // 2.
    getOpeningBalance() {
        // set header tooltip
        let setTooltip: DoubleRowInterface = {
            employee: 'Customer Contributions',
            employer: 'Employer Contributions',
        };
        this.pensionProduct.detailObjs[PensionTags.OpeningBalance].doubleRowHeader = setTooltip;

        let reqData = new OpeningBalanceReq();
        reqData.memberId = this.policyData.accountNumber;
        reqData.statementYear = this.selectedYr
        reqData.LobSrc = Lob.PENSION;
        // reqData.balanceDate = Utils.DateToYYYYMMDD(new Date());

        let keys = [
            "openingBalance_details", 
            "openingBalanceRegistered_details", 
            "openingBalance_registered_details", 
            "ee_closing_bal_value", 
            "er_closing_bal_value", 
            "openingBalanceUnregistered_details", 
            "openingBalance_Unregistered_details", 
            "ee_closing_bal_value", 
            "er_closing_bal_value", 
            "asat"
        ];
        this.pensionProduct.detailObjs[PensionTags.OpeningBalance].detail = { tableData: [], sum: 0.0 };

        this.getStOpenBalanceService.getOpenBalance(reqData, (resp: OpeningBalanceResp) => {
            this.pensionProduct.detailObjs[PensionTags.OpeningBalance].detail = this.formatTableData(resp.accountDetails, keys);
            this.pensionProduct.detailObjs[PensionTags.OpeningBalance].responseReceived = true;
        },
            (err: boolean) => {
                this.logonService.getToken((isTokenValid: boolean) => {
                    if (isTokenValid) {
                        this.getOpeningBalance();
                    }
                })
            });
    }

    // 3.
    getMonthlyContribution() {
        // set header tooltip
        let setTooltip: DoubleRowInterface = {
            employee: 'Customer Contributions',
            employer: 'Employer Contributions',
        };
        this.pensionProduct.detailObjs[PensionTags.MonthlyContribution].doubleRowHeader = setTooltip;

        let reqData = new ContributionsReq();
        reqData.memberId = this.policyData.accountNumber;
        reqData.statementYear = this.selectedYr;
        reqData.LobSrc = Lob.PENSION;
        //  reqData.balanceDate = Utils.DateToYYYYMMDD(new Date());

        let keys = [
            "contributionsPension_detail", 
            "contributions_registered_details", 
            "None", 
            "ee", 
            "er", 
            "contributions_Unregistered_details", 
            "None", 
            "ee", 
            "er", 
            "date_paid"
        ];

        this.pensionProduct.detailObjs[PensionTags.MonthlyContribution].detail = { tableData: [], sum: 0.0  };

        this.getStContributionsService.getContributions(reqData, (resp: ContributionsResp) => {
            let data = [];
            if (Array.isArray(resp.accountDetails[0].contributions_details.groupContributionsPension_detail)) {
                data = resp.accountDetails[0].contributions_details.groupContributionsPension_detail;
            }
            else if (!Array.isArray(resp.accountDetails[0].contributions_details.groupContributionsPension_detail)) {
                data.push(resp.accountDetails[0].contributions_details.groupContributionsPension_detail);
            }
            this.pensionProduct.detailObjs[PensionTags.MonthlyContribution].detail = this.formatTableData(data, keys);
            this.pensionProduct.detailObjs[PensionTags.MonthlyContribution].responseReceived = true;
        },
            (err: boolean) => {
                this.logonService.getToken((isTokenValid: boolean) => {
                    if (isTokenValid) {
                        this.getMonthlyContribution();
                    }
                })
            });
    }

    // 4.
    getBenefitPayments() {
        // set header tooltip
        let setTooltip: DoubleRowInterface = {
            date: 'Date of withdrawal',
            employee: 'Customer Balance Withdrawn',
            employer: 'Employer Balance Withdrawn',
        };
        this.pensionProduct.detailObjs[PensionTags.BenefitPayments].doubleRowHeader = setTooltip;
        
        let reqData = new BenefitPaymentsReq();
        reqData.memberId = this.policyData.accountNumber;
        reqData.statementYear = this.selectedYr;
        reqData.LobSrc = Lob.PENSION;
        // reqData.balanceDate = Utils.DateToYYYYMMDD(new Date());

        let keys = [
            "benefitPayments_details.groupBenefitPaymentsPension_detail.benefitPaymentsPension_detail", 
            "benefitPayments_registered_details", 
            "None", 
            "ee", 
            "er", 
            "benefitPayments_Unregistered_details", 
            "None", 
            "ee", 
            "er", 
            "date_paid"
        ];

        this.pensionProduct.detailObjs[PensionTags.BenefitPayments].detail = { tableData: [], sum: 0.0  };

        this.getStBenefitPaymentsService.getBenefit(reqData, (resp: BenefitPaymentsResp) => {
            this.pensionProduct.detailObjs[PensionTags.BenefitPayments].detail = this.formatTableData(resp.accountDetails, keys);
            this.pensionProduct.detailObjs[PensionTags.BenefitPayments].responseReceived = true;
        },
            (err: boolean) => {
                this.logonService.getToken((isTokenValid: boolean) => {
                    if (isTokenValid) {
                        this.getBenefitPayments();
                    }
                })
            });
    }

    // 5.
    getInvestmentIncome() {
        // set header tooltip
        let setTooltip: DoubleRowInterface = {
            employee: 'Customer Contributions',
            employer: 'Employer Contributions',
        };
        this.pensionProduct.detailObjs[PensionTags.InvestmentIncome].doubleRowHeader = setTooltip;

        let reqData = new InvestmentIncomeReq();
        reqData.memberId = this.policyData.accountNumber;
        reqData.statementYear = this.selectedYr;
        reqData.LobSrc = Lob.PENSION;
        reqData.balanceDate = Utils.DateToYYYYMMDD(new Date(this.closingBalDate));

        let keys = [
            "getInvestmentIncomes_details", 
            "getInvestmentIncomesRegistered_details", 
            "investmentIncomes_Registered_details", 
            "ee_fund_interest", 
            "er_fund_interest", 
            "getInvestmentIncomesUnregistered_details", 
            "investmentIncomes_Unregistered_details", 
            "ee_fund_interest", 
            "er_fund_interest", 
            "asat",
            "ee_tax_on_interest",
            "er_tax_on_interest"
        ]
        this.pensionProduct.detailObjs[PensionTags.InvestmentIncome].detail = { tableData: [], sum: 0.0  };

        this.getInvestmentIncomeService.getIncome(reqData, (resp: InvestmentIncomeResp) => {
            let arr = [];
            arr.push(resp.accountDetails);
            this.pensionProduct.detailObjs[PensionTags.InvestmentIncome].detail = this.formatTableData(arr, keys);
            this.pensionProduct.detailObjs[PensionTags.InvestmentIncome].responseReceived = true;
        },
            (err: boolean) => {
                this.logonService.getToken((isTokenValid: boolean) => {
                    if (isTokenValid) {
                        this.getInvestmentIncome();
                    }
                })
            });
    }

    // 6.
    getClosingBalance() {
        // set header tooltip
        let setTooltip: DoubleRowInterface = {
            employee: 'Customer Contributions',
            employer: 'Employer Contributions',
        };
        this.pensionProduct.detailObjs[PensionTags.ClosingBalance].doubleRowHeader = setTooltip;

        let reqData = new ClosingBalanceReq();
        reqData.memberId = this.policyData.accountNumber;
        reqData.statementYear = this.selectedYr;
        reqData.LobSrc = Lob.PENSION;
        // reqData.balanceDate = Utils.DateToYYYYMMDD(new Date());

        let keys = [
            "closingBalance_details", 
            "closingBalanceRegistered_details", 
            "closingBalance_registered_details", 
            "ee_closing_bal_value", 
            "er_closing_bal_value", 
            "closingBalanceUnregistered_details", 
            "closingBalance_Unregistered_details", 
            "ee_closing_bal_value", 
            "er_closing_bal_value", 
            "asat"
        ];
        this.pensionProduct.detailObjs[PensionTags.ClosingBalance].detail = { tableData: [], sum: 0.0 };

        this.getStClosingBalanceService.getClosingBalance(reqData, (resp: ClosingBalanceResp) => {
            this.pensionProduct.detailObjs[PensionTags.ClosingBalance].detail = this.formatTableData(resp.accountDetails, keys);
            this.pensionProduct.detailObjs[PensionTags.ClosingBalance].responseReceived = true;
            this.getInvestmentIncome();
        },
            (err: boolean) => {
                this.logonService.getToken((isTokenValid: boolean) => {
                    if (isTokenValid) {
                        this.getClosingBalance();
                    }
                })
            });
    }

    
    public formatTableData(openingBalanceResponse, keys) {

        openingBalanceResponse = openingBalanceResponse;
        let jsonObject = null;
        let returnObj = [];
        let obj = null;
        let registeredAmount = null;
        let unregisteredAmount = null;
        let erregisteredAmount = null;
        let erunregisteredAmount = null;
        let sum = 0.0;
        let data = {
            sum: sum,
            tableData: returnObj
        }
        try {
            if (openingBalanceResponse && openingBalanceResponse.length > 0) {
                for (var index = 0; index < openingBalanceResponse.length; index++) {
                    registeredAmount = 0.0;
                    unregisteredAmount = 0.0;
                    erregisteredAmount = 0.0;
                    erunregisteredAmount = 0.0;
                    let eeRegTax = 0.0;
                    let erRegTax = 0.0;
                    jsonObject = _.get(openingBalanceResponse[index], keys[0]);
                    obj = {};
                    let regObj = jsonObject[keys[1]];
                    if (regObj) {
                        regObj = keys[2] == 'None' ? jsonObject[keys[1]] : regObj[keys[2]];
                        registeredAmount = regObj[keys[3]] ? parseFloat(regObj[keys[3]]) : 0.00;
                        erregisteredAmount = regObj[keys[4]] ? parseFloat(regObj[keys[4]]) : 0.00;
                        eeRegTax = regObj[keys[10]] ? parseFloat(regObj[keys[10]]) : 0.00;
                        erRegTax = regObj[keys[11]] ? parseFloat(regObj[keys[11]]) : 0.00;
                    }
                    obj["registeredAmount"] = registeredAmount - eeRegTax;
                    obj["erregisteredAmount"] = erregisteredAmount - erRegTax;
                    let unregObj = jsonObject[keys[5]];
                    if (unregObj) {
                        unregObj = keys[6] == 'None' ? jsonObject[keys[5]] : unregObj[keys[6]];
                        unregisteredAmount = unregObj[keys[7]] ? parseFloat(unregObj[keys[7]]) : 0.00;
                        erunregisteredAmount = unregObj[keys[8]] ? parseFloat(unregObj[keys[8]]) : 0.00;
                        eeRegTax = unregObj[keys[10]] ? parseFloat(unregObj[keys[10]]) : 0.00;
                        erRegTax = unregObj[keys[11]] ? parseFloat(unregObj[keys[11]]) : 0.00;
                    } else {
                        unregisteredAmount = 0.00;
                        erunregisteredAmount = 0.00;
                    }
                    obj["unregisteredAmount"] = unregisteredAmount - eeRegTax;
                    obj["erunregisteredAmount"] = erunregisteredAmount - erRegTax;
                    obj["totalAmount"] = obj["registeredAmount"] + obj["unregisteredAmount"];
                    obj["ertotalAmount"] =  obj["erregisteredAmount"] + obj["erunregisteredAmount"];
                    obj["date"] = jsonObject[keys[9]];

                    this.closingBalDate = obj["date"];
                    returnObj.push(obj);
                    sum = sum + obj["totalAmount"] + obj["ertotalAmount"];
                }
            }
        } catch (e) {
            console.error(e);
        }
        data.sum = sum;
        return data;
    }

    accordionClicked(tag: string) {
        this.selectedTag = tag;
    }

    getYears(count?: number): Array<string> {
        let yrArray: string[] = [];
        let yr = new Date().getFullYear();

        this.selectedYr = new Date().getFullYear().toString();

        let yrLength = yr - 2017;
        for (let i = 0; i < yrLength; i++) {
            yrArray.push(yr.toString());
            yr--;
        }

        console.log('getLastTenYr->', yrArray);
        return yrArray;
    }

    onYrSelect(yr: string) {
        console.log(yr);
        this.setupPage();
    }

    getDownloadUrl() {
        if (Environment.qa) {
            this.downloadUrl = ApiUrl.profileImgUrl + "/statement?p_p_id=Statment_INSTANCE_bRQEKfLXyzKD&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_cacheability=cacheLevelPage&_Statment_INSTANCE_bRQEKfLXyzKD_cmd=downloadSt&_Statment_INSTANCE_bRQEKfLXyzKD_policyNumber=" + this.policyData.accountNumber + "&_Statment_INSTANCE_bRQEKfLXyzKD_statementYear=" + this.selectedYr;
        }
        else if (Environment.uatHttps || Environment.uat) {
            this.downloadUrl = ApiUrl.profileImgUrl + "/statement?p_p_id=Statment_INSTANCE_Ydz0bTDrePTJ&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_cacheability=cacheLevelPage&_Statment_INSTANCE_Ydz0bTDrePTJ_cmd=downloadSt&_Statment_INSTANCE_Ydz0bTDrePTJ_policyNumber=" + this.policyData.accountNumber + "&_Statment_INSTANCE_Ydz0bTDrePTJ_statementYear=" + this.selectedYr;
        }
        else if (Environment.prod) {
            this.downloadUrl = ApiUrl.profileImgUrl + "/statement?p_p_id=Statment_INSTANCE_Ydz0bTDrePTJ&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_cacheability=cacheLevelPage&_Statment_INSTANCE_Ydz0bTDrePTJ_cmd=downloadSt&_Statment_INSTANCE_Ydz0bTDrePTJ_policyNumber=" + this.policyData.accountNumber + "&_Statment_INSTANCE_Ydz0bTDrePTJ_statementYear=" + this.selectedYr;
        }
        else {
            console.log('getDownloadUrl url not found');
        }
       
        console.log(this.downloadUrl);

        let opts: string = "location=yes,clearcache=yes,hidespinner=no"
        this.iab.create(this.downloadUrl, '_system', opts);
    }


}
