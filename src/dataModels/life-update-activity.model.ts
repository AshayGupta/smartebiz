import { ApiResource } from "../common/interfaces/serializer";

export class UpdateActivityReq {
    sRNumber: string;
    summary: string;
    type: string;
    status: string;
}

export class UpdateActivityResp extends ApiResource {

    sRNumber: string;
    message: string;
    activityCreated: string;

    constructor(json?: any) {
        super(json);
        if (json && json.data && json.data.return) {
            let _json = json.data.return;
            this.sRNumber = _json.sRNumber;
            this.message = _json.message;
            this.activityCreated = _json.activityCreated;
        }
    }
}

export class UpdateActivitySerializer {
    toJson(obj: UpdateActivityReq): any {
        console.log('UpdateActivitySerializer toJson -> ', obj);
        return {
            sRNumber: obj.sRNumber,
            summary: obj.summary,
            type: obj.type,
            status: obj.status
        };
    }
    fromJson(json: any): UpdateActivityResp {
        console.log('UpdateActivitySerializer fromJson -> ', json);
        let response = new UpdateActivityResp(json);
        return response;
    }
}