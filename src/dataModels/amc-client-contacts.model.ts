import { ApiResource } from "../common/interfaces/serializer";
import { AccountDetails, Caption } from "./account-details.model";


export class AmcClientContactsReq {
    nationalIdNumber: string;
    formatted: boolean = false;
}

export class AmcClientContactsResp extends ApiResource {
    clientContacts = [];

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

        this.clientContacts.push(accountDetails);
        this.clientContacts.push(captions);

    }
}

export class AmcClientContactsSerializer {

    toJson(obj: AmcClientContactsReq): any {
        console.log('AmcClientContactsSerializer toJson -> ', obj);
        return {
            nationalIdNumber: obj.nationalIdNumber,
        };
    }

    fromJson(json: any): AmcClientContactsResp {
        console.log('AmcClientContactsSerializer fromJson -> ', json);
        let response = new AmcClientContactsResp(json);
        return response;
    }
}