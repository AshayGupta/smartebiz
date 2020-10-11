import { ApiResource } from "../common/interfaces/serializer";
import { AddBeneficiaryReq } from './add-beneficiary.mode';
import { UserDetails } from "./user-details.model";

export class ManageCollectionPensionReq {
    policyNo: string;
}


export class ManageCollectionPensionResp extends ApiResource {
    id: string;
    request: AddBeneficiaryReq;

    constructor(json?: any) {
        super(json);

        if (json && json.data && json.data.length > 0) {
            let _json = json.data[json.data.length -1];
            // let _json = json.data[0];

            this.request = _json.request;
            this.id = _json._id;
        }

    }

}

export class ManageCollectionPensionSerializer {

    toJson(obj: ManageCollectionPensionReq): any {
        console.log('ManageCollectionPensionSerializer toJson -> ', obj);
        return {
        };
    }

    fromJson(json: any): ManageCollectionPensionResp {
        console.log('ManageCollectionPensionSerializer fromJson -> ', json);
        let response = new ManageCollectionPensionResp(json);
        return response;
    }
}