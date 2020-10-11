import { ApiResource } from "../common/interfaces/serializer";
import { AccountList } from "./account-list.model";

export class GeneralInsuranceReq {
    nationalID: string;
}

export class GeneralInsuranceResp extends ApiResource {
    accountsList: AccountList[] = [];

    constructor(json: any) {
        super(json);

        let _json = json.data
        let _jsonGI = _json.GI;
        for(var i=0; i<_jsonGI.length; i++) {
            let lists = new AccountList(_jsonGI[i]);
            this.accountsList.push(lists);
        }
        
    }
}

export class GeneralInsuranceSerializer {

    toJson(obj: GeneralInsuranceReq): any {
        console.log('GeneralInsuranceSerializer toJson -> ', obj);
        return {
            nationalID: obj.nationalID
        };
    }

    fromJson(json: any): GeneralInsuranceResp {
        console.log('GeneralInsuranceSerializer fromJson -> ', json);
        let response = new GeneralInsuranceResp(json);
        return response;
    }
}