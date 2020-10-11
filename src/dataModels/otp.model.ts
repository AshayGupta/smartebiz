import { ApiResource } from "../common/interfaces/serializer";

export class OtpReq {
    idOptionKey: string;
    idValue: string;
    mobile: string;
}

export class OtpResp extends ApiResource {
    otp: string;
    userPhone: string;
    viewOtp: string;

    constructor(json: any) {
        super(json);

        let _json = json.data;

        this.otp = _json.otp;
        this.userPhone = _json.userPhoneNumber;
        this.viewOtp = _json.viewOtp;
    }
}


export class OtpSerializer {

    toJson(obj: OtpReq): any {
        console.log('OtpSerializer toJson -> ', obj);
        return {
            key: obj.idOptionKey,
            value: obj.idValue,
            mobileNumber: obj.mobile
        };
    }

    fromJson(json: any): OtpResp {
        console.log('OtpSerializer fromJson -> ', json);
        let response = new OtpResp(json);
        return response;
    }
}