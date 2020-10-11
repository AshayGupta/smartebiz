import { ApiResource } from "../common/interfaces/serializer";

export class OpeningBalanceReq {
    balanceDate: string;
    statementYear: string;
    LobSrc: string;
    memberId: string;
}

export class OpeningBalanceResp extends ApiResource {
    accountDetails: any[] = [];

    constructor(json?: any) {
        super(json);

        let _json = json.data;

        if (_json) {
            this.accountDetails = _json;
        }
        
    }
}


export class OpeningBalanceSerializer {

    toJson(obj: OpeningBalanceReq): any {
        console.log('OpeningBalanceSerializer toJson -> ', obj);
        return obj;
    }

    fromJson(json: any): OpeningBalanceResp {
        console.log('OpeningBalanceSerializer fromJson -> ', json);
        let response = new OpeningBalanceResp(json);

        return response;
    }
}