import { ApiResource } from "../common/interfaces/serializer";
import { AccountDetails, Caption } from "./account-details.model";


export class LifeAccountBonusesReq {
    accountNumber: string;
}

export class LifeAccountBonusesResp extends ApiResource {
    accountBonuses = [];

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

        this.accountBonuses.push(accountDetails);
        this.accountBonuses.push(captions);

    }
}

export class LifeAccountBonusesSerializer {

    toJson(obj: LifeAccountBonusesReq): any {
        console.log('LifeAccountBonusesSerializer toJson -> ', obj);
        return {
            accountNumber: obj.accountNumber,
        };
    }

    fromJson(json: any): LifeAccountBonusesResp {
        console.log('LifeAccountBonusesSerializer fromJson -> ', json);
        let response = new LifeAccountBonusesResp(json);
        return response;
    }
}