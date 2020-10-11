import { ApiResource } from "../common/interfaces/serializer";

export class ContributionsReq {
    balanceDate: string;
    statementYear: string;
    LobSrc: string;
    memberId: string;
}

export class ContributionsResp extends ApiResource {
    accountDetails: any[] = [];

    constructor(json?: any) {
        super(json);

        let _json = json.data;

        this.accountDetails = _json;
    }
}


export class ContributionsSerializer {

    toJson(obj: ContributionsReq): any {
        console.log('ContributionsSerializer toJson -> ', obj);
        return obj;
    }

    fromJson(json: any): ContributionsResp {
        console.log('ContributionsSerializer fromJson -> ', json);
        let response = new ContributionsResp(json);

        return response;
    }
}