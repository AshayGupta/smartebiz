import { ApiResource } from "../common/interfaces/serializer";

export class LogonReq {

}

export class LogonResp extends ApiResource {
    auth: boolean;
    token: string;

    constructor(json: any) {
        super(json);

        this.auth = json.auth;
        this.token = json.token;
    }
}


export class LogonSerializer {

    toJson(obj: LogonReq): any {
        console.log('LogonSerializer toJson -> ', obj);
        return {
        };
    }

    fromJson(json: any): LogonResp {
        console.log('LogonSerializer fromJson -> ', json);

        let response = new LogonResp(json);

        return response;
    }
}