import { ApiResource } from "../common/interfaces/serializer";

export class SetPasswordReq {
    idOptionKey: string;
    idValue: string;
    password: string;
    currentPassword: string;
    confirmPassword: string;
}

export class SetPasswordResp extends ApiResource {
  status:number;
  msg:string;

    // otp: string;
    // userPhone: string;
    // viewOtp: string;

    constructor(json: any) {
        super(json);

        let _json = json.data;

        this.status = _json.statusCode;
        this.msg = _json.message;
        // this.viewOtp = _json.viewOtp;
    }
}


export class SetPasswordSerializer {

    toJson(obj: SetPasswordReq): any {
        console.log('SetPasswordSerializer toJson -> ', obj);
        return {
            key: obj.idOptionKey,
            value: obj.idValue,
            pwd: obj.password,
            currentPassword: obj.currentPassword,
            confirmPassword: obj.confirmPassword
        };
    }

    fromJson(json: any): SetPasswordResp {
        console.log('SetPasswordSerializer fromJson -> ', json);
        let response = new SetPasswordResp(json);
        return response;
    }
}
