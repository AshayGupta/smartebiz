import { ApiResource } from "../common/interfaces/serializer";
import { AccountDetails, Caption } from "./account-details.model";



export class AmcNomineesListReq {
    accountNumber: string;
    formatted: boolean = true;
}

export class AmcNomineesListResp extends ApiResource {
    accountNominees = [];

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

        this.accountNominees.push(accountDetails);
        this.accountNominees.push(captions);

    }
}

export class AmcNomineesListSerializer {

    toJson(obj: AmcNomineesListReq): any {
        console.log('AmcNomineesListSerializer toJson -> ', obj);
        return {
            accountNumber: obj.accountNumber,
            formatted: obj.formatted
        };
    }

    fromJson(json: any): AmcNomineesListResp {
        console.log('AmcNomineesListSerializer fromJson -> ', json);
        let response = new AmcNomineesListResp(json);
        return response;
    }
}