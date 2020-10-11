import { ApiResource } from "../common/interfaces/serializer";
import { AccountDetails, Caption } from "./account-details.model";


export class AmcFundTransactionReq {
    accountNumber: string;
    fromDate: string;
    toDate: string;
}

export class AmcFundTransactionResp extends ApiResource {
    accountTransactions = [];

    constructor(json: any) {
        super(json);

        let _json = json.data;

        let accountDetails: AccountDetails[][] = [];
        let captions: Caption[] = [];

        for (var i = 0; i < _json.length; i++) {
            let detailsList: AccountDetails[] = [];
            for (var j = 0; j < _json[i].length; j++) {
                let details = new AccountDetails(_json[i][j]);
                detailsList.push(details);
                if (i == 0) {
                    captions.push(details.caption);
                }
            }
            accountDetails.push(detailsList);
        }

        this.accountTransactions.push(accountDetails);
        this.accountTransactions.push(captions);
    }
}

export class AmcFundTransactionSerializer {

    toJson(obj: AmcFundTransactionReq): any {
        console.log('AmcFundTransactionSerializer toJson -> ', obj);
        return {
            accountNumber: obj.accountNumber,
            fromDate: obj.fromDate,
            toDate: obj.toDate,
        };
    }

    fromJson(json: any): AmcFundTransactionResp {
        console.log('AmcFundTransactionSerializer fromJson -> ', json);
        let response = new AmcFundTransactionResp(json);
        return response;
    }
}