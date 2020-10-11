import { ApiResource } from "../common/interfaces/serializer";
import { AmcAccountList } from "./amc-account-list.model";


export class AssetManagementReq {
    nationalID: string;
}

export class AssetManagementResp extends ApiResource {
    accountsList: AmcAccountList[] = [];

    constructor(json: any) {
        super(json);

        let _json = json.data
        for(var i=0; i<_json.length; i++) {
            let accounts = new AmcAccountList(_json[i]);
            this.accountsList.push(accounts);
        }
        
    }
}

export class AssetManagementSerializer {

    toJson(obj: AssetManagementReq): any {
        console.log('AssetManagementSerializer toJson -> ', obj);
        return {
            nationalIdNumber: obj.nationalID
        };
    }

    fromJson(json: any): AssetManagementResp {
        console.log('AssetManagementSerializer fromJson -> ', json);
        let response = new AssetManagementResp(json);
        return response;
    }
}