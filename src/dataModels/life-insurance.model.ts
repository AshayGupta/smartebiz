import { ApiResource } from "../common/interfaces/serializer";
import { AccountList } from "./account-list.model";

export class LifeInsuranceReq {
    nationalID: string;
}

export class LifeInsuranceResp extends ApiResource {
    accountsList: AccountList[] = [];

    constructor(json: any) {
        super(json);

        let _json = json.data;
        for(var i=0; i<_json.length; i++) {
            let lists = new AccountList(_json[i]);
            this.accountsList.push(lists);
        }   
    }
}

export class LifeInsuranceSerializer {

    toJson(obj: LifeInsuranceReq): any {
        console.log('LifeInsuranceSerializer toJson -> ', obj);
        return {
            nationalID: obj.nationalID
        };
    }

    fromJson(json: any): LifeInsuranceResp {
        console.log('LifeInsuranceSerializer fromJson -> ', json);
        let response = new LifeInsuranceResp(json);
        return response;
    }
}