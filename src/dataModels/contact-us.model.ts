import { ApiResource } from "../common/interfaces/serializer";

export class ContactUsReq {
    name: string;
    email: string;
    countryCode: string;
    phone: string;
    comment: string;
    callBack: string;
}

export class ContactUsResp extends ApiResource {
    successMessage: string;

    constructor(json?: any) {
        super(json);

        if (json) {
            let _json = json.data;
            this.successMessage = _json.successMessage;
        }
    }
}

export class ContactUsSerializer {

    toJson(obj: ContactUsReq): any {
        console.log('ContactUsSerializer toJson -> ', obj);
        return {
            name: obj.name,
            email: obj.email,
            countryCode: obj.countryCode,
            phoneNumber: obj.phone,
            comments: obj.comment,
            callmeback: obj.callBack,
            userIp: '1.0'
        };
    }

    fromJson(json: any): ContactUsResp {
        console.log('ContactUsSerializer fromJson -> ', json);
        let response = new ContactUsResp(json);
        return response;
    }
}