import { ApiResource } from "../common/interfaces/serializer";
import { AccountDetails, AccountDetailReq } from "./account-details.model";


export class AmcAccountDetailsReq {
    accountDetailReq = new AccountDetailReq();
}

export class AmcAccountDetailsResp extends ApiResource {
    policyDetails: AccountDetails[] = [];
    jointHoldersDetails: AccountDetails[] = [];
    financialAdvisorDetails: AccountDetails[] = [];

    constructor(json: any) {
        super(json);

        let _json = json.data;
        let _policyDetails = _json.policyDetails;
        let _jointHolders = _json.jointHolders;
        let _financialAdvisorDetails = _json.financialAdvisorDetails;

        if (_policyDetails) {
            for (var i = 0; i < _policyDetails.length; i++) {
                let details = new AccountDetails(_policyDetails[i]);
                this.policyDetails.push(details);
            }
        }

        if (_jointHolders) {
            for (var j = 0; j < _jointHolders.length; j++) {
                let details = new AccountDetails(_jointHolders[j]);
                this.jointHoldersDetails.push(details);
            }
        }

        if (_financialAdvisorDetails) {
            for (var k = 0; k < _financialAdvisorDetails.length; k++) {
                let details = new AccountDetails(_financialAdvisorDetails[k]);
                this.financialAdvisorDetails.push(details);
            }
        }

    }
}

export class AmcAccountDetailsSerializer {

    toJson(obj: AmcAccountDetailsReq): any {
        console.log('AmcAccountDetailsSerializer toJson -> ', obj);
        return {
            accountNumber: obj.accountDetailReq.accountNumber,
            formatted: obj.accountDetailReq.formatted
        };
    }

    fromJson(json: any): AmcAccountDetailsResp {
        console.log('AmcAccountDetailsSerializer fromJson -> ', json);
        let response = new AmcAccountDetailsResp(json);
        return response;
    }
}