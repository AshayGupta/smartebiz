import { ApiResource } from "../common/interfaces/serializer";

export class HtmlContentReq {
    contentType: string;
}

export class HtmlContentResp extends ApiResource {
    content: string;

    constructor(json: any) {
        super(json);

        let _json = json.data;

        this.content = _json.content;
    }
}


export class HtmlContentSerializer {

    toJson(obj: HtmlContentReq): any {
        console.log('HtmlContentSerializer toJson -> ', obj);
        return {
            contentType: obj.contentType
        };
    }

    fromJson(json: any): HtmlContentResp {
        console.log('HtmlContentSerializer fromJson -> ', json);

        let response = new HtmlContentResp(json);

        return response;
    }
}