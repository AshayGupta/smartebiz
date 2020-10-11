import { ApiResource } from "../common/interfaces/serializer";

export class RemoveQuoteReq {
    perNo: string;
    policyNo: string;
    source: string;
    lobSrc: string;
    amount: string;
}

export class RemoveQuoteResp extends ApiResource {

    status: string;

    constructor(json: any) {
        super(json);

        let _json = json.data;

        this.status = _json.status;

    }
}

export class RemoveQuoteSerializer {

    toJson(obj: RemoveQuoteReq): any {
        console.log('RemoveQuoteSerializer toJson -> ', obj);
        return {
            perno: obj.perNo,
            policyNo: obj.policyNo,
            source: obj.source,
            lobSrc: obj.lobSrc,
            amount: obj.amount
        };
    }

    fromJson(json: any): RemoveQuoteResp {
        console.log('RemoveQuoteSerializer fromJson -> ', json);
        let response = new RemoveQuoteResp(json);
        return response;
    }
}