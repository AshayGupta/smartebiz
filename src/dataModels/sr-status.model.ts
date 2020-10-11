import { UserDetails } from './user-details.model';
import { ApiResource } from "../common/interfaces/serializer";

export class SRStatusReq {
    lobSrc: string;
    SRNumber: string;
    nationalIdNumber: string;
}

export class SRStatusResp extends ApiResource {
    status: string;
    // userDetails: UserDetails = new UserDetails();

    constructor(json?: any) {
        super(json);

        if (json) {
            let _json = json.data[0];

            this.status = _json.Status;
            // this.userDetails = new UserDetails(_json.userDetails);
        }
       
    }
}


export class SRStatusSerializer {

    toJson(obj: SRStatusReq): any {
        console.log('SRStatusSerializer toJson -> ', obj);
        return obj;
    }

    fromJson(json: any): SRStatusResp {
        console.log('SRStatusSerializer fromJson -> ', json);

        return new SRStatusResp(json);
    }
}