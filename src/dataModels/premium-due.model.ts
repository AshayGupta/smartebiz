import { ApiResource } from "../common/interfaces/serializer";

export class LoanOutstanding {
    amount: string;
    type: string;
    loanCheckboxStatus: boolean;
}

export class PremiumDueReq {
    lobSrc: string;
    faID: string;
    accountNumber: string;
    personNumber: string;
    siteAgentNumber: string;
    index = 0;
}

export class PremiumDueResp extends ApiResource {
    accountNumber: string;
    premiumAmount: string;
    suspenseAmount: string;
    loanOutstanding: LoanOutstanding[] = [];

    constructor(json?: any) {
        super(json);

        if (json) {
            let _json = json.data.AccountProxyServices.return;

            if (!_json) return;

            this.accountNumber = _json.accountNumber;
            this.premiumAmount = _json.premiumAmount;
            this.suspenseAmount = _json.suspenseAmount;

            if (_json.loanOutstandingList && _json.loanOutstandingList.loanOutstanding) {

                if (!Array.isArray(_json.loanOutstandingList.loanOutstanding)) {
                    let lo = new LoanOutstanding();
                    lo.amount = _json.loanOutstandingList.loanOutstanding.amount;
                    lo.type = _json.loanOutstandingList.loanOutstanding.loanType;
                    this.loanOutstanding.push(lo);
                }
                else {
                    for (var i=0; i<_json.loanOutstandingList.loanOutstanding.length; i++) {
                        let lo = new LoanOutstanding();
                        lo.amount = _json.loanOutstandingList.loanOutstanding[i].amount;
                        lo.type = _json.loanOutstandingList.loanOutstanding[i].loanType;
                        this.loanOutstanding.push(lo);
                    }
                }
            }
        }

    }
}

export class PremiumDueSerializer {

    toJson(obj: PremiumDueReq): any {
        console.log('PremiumDueSerializer toJson -> ', obj);
        return {
            LobSrc: obj.lobSrc,
            faID: obj.faID,
            accountNumber: obj.accountNumber,
            personNumber: obj.personNumber,
            siteAgentNumber: obj.siteAgentNumber
        };
    }

    fromJson(json: any): PremiumDueResp {
        console.log('PremiumDueSerializer fromJson -> ', json);
        let response = new PremiumDueResp(json);
        return response;
    }
}
