import { ApiResource } from "../common/interfaces/serializer";
import { Utils } from "../common/utils/utils";

export class LoanTaken {
    amount: string;
    loanList: LoanList[] = [];

    constructor(json?) {
        if (json) {

            this.amount = json.amount;

            if (json.loanList) {
                if (Array.isArray(json.loanList)) {
                    for (var i = 0; i < json.loanList.length; i++) {
                        let loan = new LoanList();
                        loan.loanType = json.loanList[i].loanType;
                        loan.loanAmount = json.loanList[i].loanAmount;
                        this.loanList.push(loan);
                    }
                }
                else {
                    let loan = new LoanList();
                    loan.loanType = json.loanList.loan.loanType;
                    loan.loanAmount = json.loanList.loan.loanAmount;
                    this.loanList.push(loan);
                }
            }
        }
    }
}

export class LoanList {
    loanType: string;
    loanAmount: string;
}

export class LoanBalancesReq {
    siteAgentNo: string;
    lobSrc: string;
    perNo: string;
    toDate: string;
    policyNo: string;
    source: string;
}

export class LoanBalancesResp extends ApiResource {
    policyNo: string;
    currency: string;
    policyValue: string;
    nextLoanDate: string;
    loanLimit: string;
    loanTaken: LoanTaken = new LoanTaken();
    maxLoanAvailable: string;
    osLoanBal: string;
    backPremiums: string;
    netLoanAvailable: string;
    availableAmount: string;
    regularIncomeSelected: string;
    rateOfInterest: string;
    loanPeriod: string;

    constructor(json?: any) {
        super(json);

        if (json) {
            let _json = json.data.policy;

            this.policyNo = _json.policyNo;
            this.currency = _json.currency;
            this.availableAmount = _json.details.availableAmount;
            this.backPremiums = _json.details.backPremiums;
            this.loanLimit = _json.details.loanLimit;
            this.maxLoanAvailable = _json.details.maxLoanAvail;
            this.netLoanAvailable = _json.details.netLoanAvailable;
            this.nextLoanDate = _json.details.nextLoanDate;
            this.osLoanBal = _json.details.osLoanBal;
            this.policyValue = _json.details.policyValue;
            this.regularIncomeSelected = _json.details.regularIncomeSelected;
            this.loanTaken = new LoanTaken(_json.details.loanTaken);
            this.rateOfInterest = Utils.isEmpty(_json.rateOfInterest) ? '14.5' : _json.rateOfInterest;
            this.loanPeriod = Utils.isEmpty(_json.loanPeriod) ? '36' : _json.loanPeriod;
        }

    }

}

export class LoanBalancesSerializer {

    toJson(obj: LoanBalancesReq): any {
        console.log('LoanBalancesSerializer toJson -> ', obj);
        return {
            siteAgentno: obj.siteAgentNo,
            perno: obj.perNo,
            policyNo: obj.policyNo,
            source: obj.source,
            lobSrc: obj.lobSrc,
            toDate: obj.toDate,
        };
    }

    fromJson(json: any): LoanBalancesResp {
        console.log('LoanBalancesSerializer fromJson -> ', json);
        let response = new LoanBalancesResp(json);
        return response;
    }
} 