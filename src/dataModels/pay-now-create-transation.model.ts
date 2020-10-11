import { ApiResource } from "../common/interfaces/serializer";

export class PostedAmounts {
    accountNumber: string;
    amount: string;
}

export class PayNowCreateTransactionReq {
    msisdn: string;
    firstName: string;
    middleName: string;
    lastName: string;
    accountNumber: string;
    totalAmount: string;
    paybillNumber: string;
    lobSrc: string;
    postedAmounts: PostedAmounts[] = []
}

export class PayNowCreateTransactionResp extends ApiResource {
    code: string;
    reason: string;
    transactionId: string;

    constructor(json?: any) {
        super(json);

        if (json) {
            let _json = json.data;

            this.code = _json.code;
            this.reason = _json.reason;
            this.transactionId = _json.transaction_id;
        }

    }
}

export class PayNowCreateTransactionSerializer {

    toJson(obj: PayNowCreateTransactionReq): any {
        console.log('PayNowCreateTransactionSerializer toJson -> ', obj);
        return {
            msisdn: obj.msisdn,
            firstname: obj.firstName,
            middlename: obj.middleName,
            lastname: obj.lastName,
            accountNumber: obj.accountNumber,
            totalAmount: obj.totalAmount,
            paybillNumber: obj.paybillNumber,
            LobSrc: obj.lobSrc,
            postedAmounts: obj.postedAmounts
        };
    }

    fromJson(json: any): PayNowCreateTransactionResp {
        console.log('PayNowCreateTransactionSerializer fromJson -> ', json);
        let response = new PayNowCreateTransactionResp(json);
        return response;
    }
}