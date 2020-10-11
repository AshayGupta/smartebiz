import { ApiResource } from "../common/interfaces/serializer";

export class ClosingBalanceReq {
    balanceDate: string;
    statementYear: string;
    LobSrc: string;
    memberId: string;
}

export class ClosingBalanceResp extends ApiResource {
    accountDetails: any[] = [];

    constructor(json?: any) {
        super(json);

        let _json = json.data;

        this.accountDetails = _json;
    }
}


export class ClosingBalanceSerializer {

    toJson(obj: ClosingBalanceReq): any {
        console.log('ClosingBalanceSerializer toJson -> ', obj);
        return obj;
    }

    fromJson(json: any): ClosingBalanceResp {
        console.log('ClosingBalanceSerializer fromJson -> ', json);
        let response = new ClosingBalanceResp(json);

        return response;
    }
}