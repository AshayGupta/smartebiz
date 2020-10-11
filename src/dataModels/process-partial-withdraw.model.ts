import { ApiResource } from "../common/interfaces/serializer";
import { UserDetails } from "./user-details.model";
import { TermAndCondition } from "./amc-mongo-stages.model";

export class ProcessPartialWithdrawalReq {
    siteAgentno: string;
    perno: string;
    policyNo: string;
    policyName: string;
    source: string;
    effectiveDate: string;
    maxSellValue: string;
    chargeVal: string;
    process: string;
    lobSrc: string;
    transactionId: string;
    systemCode: string;
    countryCode: string;
    netValue: string;
    bankAccNo: string;
    bankBranch: string;
    bankName: string;
    bankNumber: string;
    accountName: string;
    withdrawalAmount: string;
    paymentMode: string;
    mobile: string;
    surrenderFee: string='0.0';
    totalSellCharge: string='0.0';
    exciseDuty: string='0.0';
    surrAdminChg: string='0.0';
    totalDeductionAmt: string='0.0';
     // deductionList: DeductionList = new DeductionList();
    userDetails: UserDetails = new UserDetails();

    branchCode:string;
    verifyAccNo:string;
    filterValue:string;

    // Employee
    totalBalance0:string = '0.00';
    totalBalance1:string = '0.00';;
    type0:string;
    type1:string;
    availableBalance1:string = '0.00';;
    availableBalance0:string = '0.00';;
    lockedInAmount1:string = '0.00';;
    lockedInAmount0:string = '0.00';;

    // Employer
    regEmployerBalance: string = '0.00';;
    regEmployerLockedInAmt: string = '0.00';;
    regEmployerAvailableBal: string = '0.00';;
    unRegEmployerBalance: string = '0.00';;
    unRegEmployerLockedInAmt: string = '0.00';;
    unRegEmployerAvailableBal: string = '0.00';;

    fundName:string;
    transactionNumber:string;
    tnc:TermAndCondition;
    verifyMobileNo:string;
}

export class ProcessPartialWithdrawalResp extends ApiResource {
    policyNo: string;
    valueDate: string;
    percCharge: string;
    chrgVal: string;
    maxSellVal: string;
    minVal: string;
    totalUnits: string;
    totalValue: string;
    totalSellUnits: string;
    totalSellValue: string;
    netValue: string;
    amount: string;
    loanPeriodMonths: string;
    startDate: string;
    valuationDate: string;
    surrenderFee: string;
    totalSellCharge: string;
    exciseDuty: string;
    surrAdminChg: string;




    constructor(json?: any) {
        super(json);

        if (json) {
            let _json = json.data;

            this.policyNo = _json.policyNo;
            this.valueDate = _json.valueDate;
            this.percCharge = _json.percCharge;
            this.chrgVal = _json.chrgVal;
            this.maxSellVal = _json.maxSellVal;
            this.minVal = _json.minVal;
            this.totalUnits = _json.totalUnits;
            this.totalValue = _json.totalValue;
            this.totalSellUnits = _json.totalSellUnits;
            this.totalSellValue = _json.totalSellValue;
            this.netValue = _json.netValue;
            this.surrenderFee = _json.surrenderFee;
            this.totalSellCharge = _json.totalSellCharge;
            this.exciseDuty = _json.exciseDuty;
            this.surrAdminChg = _json.surrAdminChg;

        }

    }
}

export class ProcessPartialWithdrawalSerializer {

    toJson(obj: ProcessPartialWithdrawalReq): any {
        console.log('ProcessPartialWithdrawalSerializer toJson -> ', obj);
        return {
            perno: obj.perno,
            policyNo: obj.policyNo,
            source: obj.source,
            maxSellValue: obj.maxSellValue,
            surrenderFee: obj.surrenderFee,
            process: obj.process,
            lobSrc: obj.lobSrc,
            countryCode: obj.countryCode,
            systemCode: obj.systemCode,
            siteAgentno: obj.siteAgentno,
            effectiveDate: obj.effectiveDate,
            chargeVal: obj.chargeVal,
            surrAdmCh: obj.surrAdminChg,
            transactionId: obj.transactionId,
            netValue: obj.netValue,
            bankAccNo: obj.bankAccNo,
            bankBranch: obj.bankBranch,
            bankName: obj.bankName,
            bankNumber: obj.bankNumber,
            userDetails: {
                idType: obj.userDetails.idType,
                idValue: obj.userDetails.idValue
            },
            totalBalance0: obj.totalBalance0,
            totalBalance1: obj.totalBalance1,
            type0:obj.type0,
            type1:obj.type1,
            availableBalance1:obj.availableBalance1,
            availableBalance0:obj.availableBalance0,
            lockedInAmount1:obj.lockedInAmount1,
            lockedInAmount0:obj.lockedInAmount0,
            fundName:obj.fundName

        };
    }

    fromJson(json: any): ProcessPartialWithdrawalResp {
        console.log('ProcessPartialWithdrawalSerializer fromJson -> ', json);
        let response = new ProcessPartialWithdrawalResp(json);
        return response;
    }
}
