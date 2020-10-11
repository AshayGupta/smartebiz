import { ApiResource } from "../common/interfaces/serializer";

export class GetProfilePicReq {
    idType: string;
    idValue: string;
}

export class GetProfilePicResp extends ApiResource {

    profileUrl: string;

    constructor(json: any) {
        super(json);

        let _json = json.data;
        this.profileUrl = _json.profileUrl;

    }
}

export class GetProfilePicSerializer {

    toJson(obj: GetProfilePicReq): any {
        console.log('GetProfilePicSerializer toJson -> ', obj);
        return {
            idType: obj.idType,
            idValue: obj.idValue,
        };
    }

    fromJson(json: any): GetProfilePicResp {
        console.log('GetProfilePicSerializer fromJson -> ', json);
        let response = new GetProfilePicResp(json);
        return response;
    }
}