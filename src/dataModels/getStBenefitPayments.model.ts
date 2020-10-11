import { ApiResource } from "../common/interfaces/serializer";

export class BenefitPaymentsReq {
    balanceDate: string;
    statementYear: string;
    LobSrc: string;
    memberId: string;
}

export class BenefitPaymentsResp extends ApiResource {
    accountDetails: any[] = [];

    constructor(json?: any) {
        super(json);

        let _json = json.data;

        this.accountDetails = _json;
    }
}


export class BenefitPaymentsSerializer {

    toJson(obj: BenefitPaymentsReq): any {
        console.log('BenefitPaymentsSerializer toJson -> ', obj);
        return obj;
    }

    fromJson(json: any): BenefitPaymentsResp {
        console.log('BenefitPaymentsSerializer fromJson -> ', json);
        let response = new BenefitPaymentsResp(json);

        return response;
    }
}