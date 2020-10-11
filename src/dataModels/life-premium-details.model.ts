import { ApiResource } from "../common/interfaces/serializer";
import { AccountDetails, Caption } from "./account-details.model";


export class LifePremiumDetailsReq {
    accountNumber: string;
}

export class LifePremiumDetailsResp extends ApiResource {
    accountPremiumDetails = [];

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

        this.accountPremiumDetails.push(accountDetails);
        this.accountPremiumDetails.push(captions);

    }
}

export class LifePremiumDetailsSerializer {

    toJson(obj: LifePremiumDetailsReq): any {
        console.log('LifePremiumDetailsSerializer toJson -> ', obj);
        return {
            accountNumber: obj.accountNumber,
        };
    }

    fromJson(json: any): LifePremiumDetailsResp {
        console.log('LifePremiumDetailsSerializer fromJson -> ', json);
        let response = new LifePremiumDetailsResp(json);
        return response;
    }
}