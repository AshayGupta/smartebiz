import { ApiResource } from "../common/interfaces/serializer";

export class VerifyOtpReq {
    idOptionKey: string;
    idValue: string;
    otp: string;
}

export class VerifyOtpResp extends ApiResource {
    // otp: string;
    // userPhone: string;
    // viewOtp: string;

    constructor(json: any) {
        super(json);

        // let _json = json.data;

        // this.otp = _json.otp;
        // this.userPhone = _json.userPhoneNumber;
        // this.viewOtp = _json.viewOtp;
    }
}


export class VerifyOtpSerializer {

    toJson(obj: VerifyOtpReq): any {
        console.log('VerifyOtpSerializer toJson -> ', obj);
        return {
            key: obj.idOptionKey,
            value: obj.idValue,
            otp: obj.otp
        };
    }

    fromJson(json: any): VerifyOtpResp {
        console.log('VerifyOtpSerializer fromJson -> ', json);
        let response = new VerifyOtpResp(json);
        return response;
    }
}