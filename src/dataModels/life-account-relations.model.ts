import { ApiResource } from "../common/interfaces/serializer";
import { AccountDetails, Caption } from "./account-details.model";


export class LifeAccountRelationsReq {
    accountNumber: string;
}

export class LifeAccountRelationsResp extends ApiResource {
    accountRelations = [];

    constructor(json: any) {
        super(json);

        let _json = json.data;

        let accountDetails: AccountDetails[][] = [];
        let captions: Caption[] = [];

        for (var i = 0; i < _json.length; i++) {
            let detailsList: AccountDetails[] = [];
            for (var j = 0; j < _json[i].length; j++) {
                let details = new AccountDetails(_json[i][j]);
                detailsList.push(details);
                if (i == 0) {
                    captions.push(details.caption);
                }
            }
            accountDetails.push(detailsList);
        }

        this.accountRelations.push(accountDetails);
        this.accountRelations.push(captions);

    }
}

export class LifeAccountRelationsSerializer {

    toJson(obj: LifeAccountRelationsReq): any {
        console.log('LifeAccountRelationsSerializer toJson -> ', obj);
        return {
            accountNumber: obj.accountNumber,
        };
    }

    fromJson(json: any): LifeAccountRelationsResp {
        console.log('LifeAccountRelationsSerializer fromJson -> ', json);
        let response = new LifeAccountRelationsResp(json);
        return response;
    }
}