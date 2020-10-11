import { ApiResource } from "../common/interfaces/serializer";
import { AccountDetails, AccountDetailReq, Caption } from "./account-details.model";


export class GiAccountDetailsReq {
    accountDetailReq = new AccountDetailReq();
}

export class GiAccountDetailsResp extends ApiResource {
    policyDetails = [];
    policyRef: string;
    queryClaims: string;

    constructor(json: any) {
        super(json);

        let _json = json.data;
        let _accountDetails = _json.accountDetails;

        let accountDetails: AccountDetails[][] = [];
        let captions: Caption[] = [];

        for (var i = 0; i < _accountDetails.length; i++) {
            let detailsList: AccountDetails[] = [];
            for (var j = 0; j < _accountDetails[i].length; j++) {
                let details = new AccountDetails(_accountDetails[i][j]);
                detailsList.push(details);
                if (i == 0) {
                    captions.push(details.caption);
                }
            }
            accountDetails.push(detailsList);
        }

        this.policyDetails.push(accountDetails);
        this.policyDetails.push(captions);

        this.policyRef = _json.policyRef;
        this.queryClaims = _json.queryClaims;

    }
}

export class GiAccountDetailsSerializer {

    toJson(obj: GiAccountDetailsReq): any {
        console.log('GiAccountDetailsSerializer toJson -> ', obj);
        return {
            accountNumber: obj.accountDetailReq.accountNumber,
            formatted: obj.accountDetailReq.formatted
        };
    }

    fromJson(json: any): GiAccountDetailsResp {
        console.log('GiAccountDetailsSerializer fromJson -> ', json);
        let response = new GiAccountDetailsResp(json);
        return response;
    }
}