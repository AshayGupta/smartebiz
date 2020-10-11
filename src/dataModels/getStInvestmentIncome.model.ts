import { ApiResource } from "../common/interfaces/serializer";

export class InvestmentIncomeReq {
    balanceDate: string;
    statementYear: string;
    LobSrc: string;
    memberId: string;
}

export class InvestmentIncomeResp extends ApiResource {
    accountDetails: any[] = [];

    constructor(json?: any) {
        super(json);

        let _json = json.data;

        this.accountDetails = _json;
    }
}


export class InvestmentIncomeSerializer {

    toJson(obj: InvestmentIncomeReq): any {
        console.log('InvestmentIncomeSerializer toJson -> ', obj);
        return obj;
    }

    fromJson(json: any): InvestmentIncomeResp {
        console.log('InvestmentIncomeSerializer fromJson -> ', json);
        let response = new InvestmentIncomeResp(json);

        return response;
    }
}