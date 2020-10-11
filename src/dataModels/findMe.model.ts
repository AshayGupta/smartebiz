import { ApiResource } from "../common/interfaces/serializer";

export class FindMeReq {
    idOptionKey: string;
    idValue: string;
}

export class FindMeResp extends ApiResource {
    // status: string;
    // userDetails: UserDetails = new UserDetails();

    // constructor(json: any) {
    //     super(json);

    //     let _json = json.data;

    //     this.status = _json.status;
    //     this.userDetails = new UserDetails(_json.userDetails);
    // }
}


export class FindMeSerializer {

    toJson(obj: FindMeReq): any {
        console.log('FindMeSerializer toJson -> ', obj);

        return {
            key: obj.idOptionKey,
            value: obj.idValue
        };
    }

    fromJson(json: any): FindMeResp {
        console.log('FindMeSerializer fromJson -> ', json);

        return new FindMeResp(json);
    }
}
