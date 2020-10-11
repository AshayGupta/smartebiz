import { ApiResource } from "../common/interfaces/serializer";
import { AccountDetails, AccountDetailReq } from "./account-details.model";


export class LifeAccountDetailsReq {
    accountDetailReq = new AccountDetailReq();
}

export class LifeAccountDetailsResp extends ApiResource {
    accountDetails: AccountDetails[] = [];

    constructor(json: any) {
        super(json);

        let _json = json.data;
        for(var i=0; i<_json.length; i++) {
            let details = new AccountDetails(_json[i]);
            this.accountDetails.push(details);
        } 

    }
}

export class LifeAccountDetailsSerializer {

    toJson(obj: LifeAccountDetailsReq): any {
        console.log('LifeAccountDetailsSerializer toJson -> ', obj);
        return {
            accountNumber: obj.accountDetailReq.accountNumber,
            formatted: obj.accountDetailReq.formatted
        };
    }

    fromJson(json: any): LifeAccountDetailsResp {
        console.log('LifeAccountDetailsSerializer fromJson -> ', json);
        let response = new LifeAccountDetailsResp(json);
        return response;
    }
}