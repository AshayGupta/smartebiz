import { ApiResource } from "../common/interfaces/serializer";

export class UpdateProfilePicReq {
    idType: string;
    idValue: string;
    profilePic: string;
}

export class UpdateProfilePicResp extends ApiResource {

    message: string;

    constructor(json?: any) {
        super(json);

        if(json) {
            let _json = json.data;
            this.message = _json.message;
        }
    }
}

export class UpdateProfilePicSerializer {

    toJson(obj: UpdateProfilePicReq): any {
        console.log('UpdateProfilePicSerializer toJson -> ', obj);
        return {
            idType: obj.idType,
            idValue: obj.idValue,
            profilePic: obj.profilePic,
        };
    }

    fromJson(json: any): UpdateProfilePicResp {
        console.log('UpdateProfilePicSerializer fromJson -> ', json);
        let response = new UpdateProfilePicResp(json);
        return response;
    }
}