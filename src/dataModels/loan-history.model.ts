import { ApiResource } from "../common/interfaces/serializer";

export class LoanHistoryReq {
    personNumber: string;
    collection: string;
}

export class LoanHistory {
    status: string;
    statusDate: string;
    amount: string;
    applicationDate: string;
    accountNumber: string;
    productName: string;
    loanApplicationNo: string;
}

export class LoanHistoryResp extends ApiResource {
    loanHistoryList: LoanHistory[] = [];

    constructor(json?: any) {
        super(json);
        if (json) {
            let _json = json.data;

            for (var i = 0; i < _json.length; i++) {
                let item = new LoanHistory();

                item.status = _json[i].response.status;
                item.statusDate = _json[i].response.statusDate;
                item.amount = _json[i].request.amount;
                item.applicationDate = _json[i].request.applicationDate;
                item.accountNumber = _json[i].request.accountNumber;
                item.productName = _json[i].request.productName;
                item.loanApplicationNo = _json[i].request.loanApplicationNo;

                this.loanHistoryList.push(item);
            }

        }

    }

}

export class LoanHistorySerializer {

    toJson(obj: LoanHistoryReq): any {
        console.log('LoanHistorySerializer toJson -> ', obj);
        return {
        };
    }

    fromJson(json: any): LoanHistoryResp {
        console.log('LoanHistorySerializer fromJson -> ', json);
        let response = new LoanHistoryResp(json);
        return response;
    }
}