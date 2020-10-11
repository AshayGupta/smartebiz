import { ApiResource } from "../common/interfaces/serializer";
import { AccountDetails, Caption } from "./account-details.model";


export class LifePolicyBenefitsReq {
    accountNumber: string;
}

export class LifePolicyBenefitsResp extends ApiResource {
    policyBenefits = [];

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

        this.policyBenefits.push(accountDetails);
        this.policyBenefits.push(captions);

    }
}

export class LifePolicyBenefitsSerializer {

    toJson(obj: LifePolicyBenefitsReq): any {
        console.log('LifePolicyBenefitsSerializer toJson -> ', obj);
        return {
            accountNumber: obj.accountNumber,
        };
    }

    fromJson(json: any): LifePolicyBenefitsResp {
        console.log('LifePolicyBenefitsSerializer fromJson -> ', json);
        let response = new LifePolicyBenefitsResp(json);
        return response;
    }
}