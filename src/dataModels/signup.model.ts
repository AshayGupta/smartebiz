import { UserDetails } from './user-details.model';
import { ApiResource } from "../common/interfaces/serializer";

export class SignupReq {
    idOptionKey: string;
    idValue: string;
    checkAgreement: boolean;
}

export class SignupResp extends ApiResource {
    status: string;
    userDetails: UserDetails = new UserDetails();

    constructor(json: any) {
        super(json);

        let _json = json.data;

        this.status = _json.status;
        this.userDetails = new UserDetails(_json.userDetails);
    }
}


export class SignupSerializer {

    toJson(obj: SignupReq): any {
        console.log('SignupSerializer toJson -> ', obj);

        return {
            key: obj.idOptionKey,
            value: obj.idValue
        };
    }

    fromJson(json: any): SignupResp {
        console.log('SignupSerializer fromJson -> ', json);

        return new SignupResp(json);
    }
}