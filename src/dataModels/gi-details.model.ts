import { ApiResource } from "../common/interfaces/serializer";
import { AccountDetails, Caption } from "./account-details.model";


export class GIDetailsReq {
    accountReference: string;
    formatted: boolean;
}

export class GIDetailsResp extends ApiResource {
    covers = [];
    invoices = [];

    constructor(json: any) {
        super(json);

        let _json = json.data;
        let _accountCovers = _json.accountCovers;
        let _invoicesList = _json.invoicesList;


        if (_accountCovers && _accountCovers.length > 0) {
            let accountDetails: AccountDetails[][] = [];
            let captions: Caption[] = [];
    
            for (var i = 0; i < _accountCovers.length; i++) {
                let detailsList: AccountDetails[] = [];
                for (var j = 0; j < _accountCovers[i].length; j++) {
                    let details = new AccountDetails(_accountCovers[i][j]);
                    detailsList.push(details);
                    if (i == 0) {
                        captions.push(details.caption);
                    }
                }
                accountDetails.push(detailsList);
            }
    
            this.covers.push(accountDetails);
            this.covers.push(captions);
        }

        if (_invoicesList && _invoicesList.length > 0) {
            let accountDetails: AccountDetails[][] = [];
            let captions: Caption[] = [];
    
            for (var y = 0; y < _invoicesList.length; y++) {
                let detailsList: AccountDetails[] = [];
                for (var z = 0; z < _invoicesList[y].length; z++) {
                    let details = new AccountDetails(_invoicesList[y][z]);
                    detailsList.push(details);
                    if (y == 0) {
                        captions.push(details.caption);
                    }
                }
                accountDetails.push(detailsList);
            }
    
            this.invoices.push(accountDetails);
            this.invoices.push(captions);
        }

    }
}

export class GIDetailsSerializer {

    toJson(obj: GIDetailsReq): any {
        console.log('GIDetailsSerializer toJson -> ', obj);
        return {
            accountReference: obj.accountReference,
            formatted: obj.formatted
        };
    }

    fromJson(json: any): GIDetailsResp {
        console.log('GIDetailsSerializer fromJson -> ', json);
        let response = new GIDetailsResp(json);
        return response;
    }
}