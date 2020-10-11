import { ApiResource } from "../common/interfaces/serializer";

export class GetTransactionNumberReq {
    policyNumber: string;
    transactionType: string;
}

export class GetTransactionNumberResp extends ApiResource {
    transactionNumber: string;

    constructor(json: any) {
        super(json);

        if (!json.data) return;
        let _json = json.data;

        this.transactionNumber = _json.transactionNumber;
    }
}

export class GetTransactionNumberSerializer {

    toJson(obj: GetTransactionNumberReq): any {
        console.log('GetTransactionNumberSerializer toJson -> ', obj);
        return obj;
    }

    fromJson(json: any): GetTransactionNumberResp {
        console.log('GetTransactionNumberSerializer fromJson -> ', json);
        let response = new GetTransactionNumberResp(json);
        return response;
    }
}