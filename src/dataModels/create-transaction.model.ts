import { PostedAmounts } from './make-payment.model';
import { ApiResource } from "../common/interfaces/serializer";
import { Utils } from './../common/utils/utils';


export class CreateTransactionReq {
    msisdn: string;
    firstName: string;
    middleName: string;
    lastName: string;
    accountNumber: string;
    totalAmount: string;
    paybillNumber: string;
    lobSrc: string;
    channel:string;
    customerId:string;
    transactionType: string;
    postedAmount: PostedAmounts[] = [];
}

export class CreateTransactionResp extends ApiResource {
    code: string;
    reason: string;
    transaction_id: string;

    constructor(json?: any) {
        super(json);

        if (json) {
            let _json = json.data;
            if (_json) {
                this.code = _json.code;
                this.reason = _json.reason;
                this.transaction_id = _json.transaction_id;
            }

        }

    }
}

export class CreateTransactionSerializer {

    toJson(obj: CreateTransactionReq): any {
        console.log('MCreateTransactionSerializer toJson -> ', obj);
        return {
            msisdn: obj.msisdn,
            firstname: obj.firstName,
            middlename: obj.middleName,
            lastname: obj.lastName,
            accountNumber: obj.accountNumber,
            totalAmount: Utils.ceilValue(obj.totalAmount),
            paybillNumber: obj.paybillNumber,
            LobSrc: obj.lobSrc,
            channel:obj.channel,
            customerId:obj.customerId,
            transactionType: obj.transactionType,
            postedAmounts: { 'postedAmount': obj.postedAmount },
        };
    }

    fromJson(json: any): CreateTransactionResp {
        console.log('CreateTransactionSerializer fromJson -> ', json);
        let response = new CreateTransactionResp(json);
        return response;
    }
}
