import { ApiResource } from "../common/interfaces/serializer";
import { AccountList } from "./account-list.model";

export class AllAccountsReq {
    nationalID: string;
    lobSrc: string;
}

export class AllAccountsResp extends ApiResource {
    allAccountsList: AccountList[] = [];

    constructor(json?: any) {
        super(json);

        if (json) {
            let _json = json.data.AccountProxyServices.return
            if (_json && _json.length > 0) {
                for (var i = 0; i < _json.length; i++) {
                    let lists = new AccountList(_json[i]);
                    this.allAccountsList.push(lists);
                }
            }
        }

    }
}

export class AllAccountsSerializer {

    toJson(obj: AllAccountsReq): any {
        console.log('AllAccountsSerializer toJson -> ', obj);
        return {
            nationalID: obj.nationalID,
            LobSrc: obj.lobSrc
        };
    }

    fromJson(json: any): AllAccountsResp {
        console.log('AllAccountsSerializer fromJson -> ', json);
        let response = new AllAccountsResp(json);
        return response;
    }
}