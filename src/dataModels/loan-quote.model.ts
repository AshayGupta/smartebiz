import { ApiResource } from "../common/interfaces/serializer";

export class LoanQuoteReq {
    perNo: string;
    policyNo: string;
    source: string;
    lobSrc: string;
}

export class LoanQuoteResp extends ApiResource {
    policyValue: string;
    policyNo: string;
    startDate: string;
    loanPeriod: string;
    nextLoanDate: string;
    backPrems: string;
    loanLimit: string;
    availableAmount: string;
    regularIncomeSelected: string;
    rateOfInterest: string;
    loanAmount: string;
    code: string;
    message: string;

    constructor(json?: any) {
        super(json);
        if (json) {

            let _json = json.data;

            this.code = _json.code;
            this.message = _json.message;

            this.policyValue = _json.policyValue;
            this.policyNo = _json.policyNo;
            this.startDate = _json.startDate;
            this.nextLoanDate = _json.nextLoanDate;
            this.backPrems = _json.backPrems;
            this.loanLimit = _json.loanLimit;
            this.regularIncomeSelected = _json.regularIncomeSelected;
            this.availableAmount = _json.availableAmount || '0.00' ;
            this.loanAmount = _json.netLoanPayable || '0.00';
            this.rateOfInterest = _json.rateOfInterest || '14.5';
            this.loanPeriod = _json.loanPeriod|| '36';
        }

    }

}

export class LoanQuoteSerializer {

    toJson(obj: LoanQuoteReq): any {
        console.log('LoanQuoteSerializer toJson -> ', obj);
        return {
            perno: obj.perNo,
            policyNo: obj.policyNo,
            source: obj.source,
            lobSrc: obj.lobSrc
        };
    }

    fromJson(json: any): LoanQuoteResp {
        console.log('LoanQuoteSerializer fromJson -> ', json);
        let response = new LoanQuoteResp(json);
        return response;
    }
}
