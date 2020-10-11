import { ApiResource } from "../common/interfaces/serializer";

export class LoginReq {
    email: string;
    password: string;
}

export class LoginResp extends ApiResource {
    firstName: string;
    lastName: string;
    mobile: string;
    nationalID: string;
    applicationNumber: string;
    email: string;
    nationalIDType: string;

    constructor(json: any) {
        super(json);

        let _json = json.data;

        this.firstName = _json.firstName;
        this.lastName = _json.lastName;
        this.mobile = _json.mobilePhone;
        this.nationalID = _json.nationalID;
        this.applicationNumber = _json.applicationNumber;
        this.email = _json.emailId;
        this.nationalIDType = _json.nationalIDType;
    }
}

export class LoginSerializer {

    toJson(obj: LoginReq): any {
        console.log('LoginSerializer toJson -> ', obj);
        return {
            username: obj.email,
            password: obj.password
        };
    }

    fromJson(json: any): LoginResp {
        console.log('LoginSerializer fromJson -> ', json);
        let loginResp = new LoginResp(json);
        return loginResp;
    }
}