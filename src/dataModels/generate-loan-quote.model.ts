import { ApiResource } from "../common/interfaces/serializer";
import { Utils } from "../common/utils/utils";

export class DeductionObject {
    deduction: Deduction = new Deduction();

    constructor(json?) {
        if (json) {
            this.deduction.type = json.type;
            this.deduction.amount = Utils.isEmpty(json.amount) ? '0.0' : json.amount;
        }
    }
}
export class DeductionList {
    deductionArray: Deduction[] = [];
    deductionSum: number = 0.00;

    constructor(json?) {
        if (json) {

            if (Array.isArray(json.deduction)) {
                for (var i = 0; i < json.deduction.length; i++) {
                    let list = new Deduction(json.deduction[i]);
                    this.deductionArray.push(list);

                    this.deductionSum += parseFloat(list.amount);
                }
            }
        }
    }
}
export class Deduction {
    type: string;
    amount: string;

    constructor(json?) {
        if (json) {
            this.type = json.type;
            this.amount = Utils.isEmpty(json.amount) ? '0.0' : json.amount;
        }
    }
}

export class SiteAgentNo {

}

export class GenerateLoanQuoteReq {
    perNo: string;
    policyNo: string;
    source: string;
    lobSrc: string;
    loanAmount: string;
    siteAgentNo: SiteAgentNo[] = [];
    loanPeriodMonths: string;
    startDate: string;
    valuationDate: string;
    deductionObject: DeductionObject = new DeductionObject();
    deductionArray: Deduction[] = [];
}

export class GenerateLoanQuoteResp extends ApiResource {
    monthlyPay: string;
    policyNo: string;
    amount: string;
    noPayments: string;
    totalInterest: string;
    totalCost: string;
    totalMonthRepmts: string;
    deductionList = new DeductionList();

    constructor(json: any) {
        super(json);

        let _json = json.data;
        this.monthlyPay = _json.monthlyPay;
        this.policyNo = _json.policyNo;
        this.amount = _json.amount;
        this.noPayments = _json.noPayments;
        this.totalInterest = _json.totalInterest;
        this.totalCost = _json.totalCost;
        this.totalMonthRepmts = _json.totalMonthRepmts;
        this.deductionList = new DeductionList(_json.deductionList);
    }
}

export class GenerateLoanQuoteSerializer {

    toJson(obj: GenerateLoanQuoteReq): any {
        console.log('GenerateLoanQuoteSerializer toJson -> ', obj);
        return {
            siteAgentno: obj.siteAgentNo,
            perno: obj.perNo,
            amount: obj.loanAmount,
            policyNo: obj.policyNo,
            source: obj.source,
            loanPeriodMonths: obj.loanPeriodMonths,
            startDate: obj.startDate,
            valuationDate: obj.valuationDate,
            lobSrc: obj.lobSrc,
            deductionList: {deduction: obj.deductionArray }
        };
    }

    fromJson(json: any): GenerateLoanQuoteResp {
        console.log('GenerateLoanQuoteSerializer fromJson -> ', json);
        let response = new GenerateLoanQuoteResp(json);
        return response;
    }
}