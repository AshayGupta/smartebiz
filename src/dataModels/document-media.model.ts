import { ApiResource } from "../common/interfaces/serializer";

export class MediaDetails {
    pension: FileData[] = [];
    gi: FileData[] = [];
    life: FileData[] = [];
}

export class FileData {
    name: string;
    url: string;
}

export class DocumentMediaReq {

}

export class DocumentMediaResp extends ApiResource {

    media: MediaDetails = new MediaDetails();

    constructor(json?: any) {
        super(json);

        if (json && json.data && json.data.data) {

            let _json = json.data.data;

            if(_json.Pension && _json.Pension.length > 0) {
                for (let j = 0; j < _json.Pension.length; j++) {
                    let item = new FileData();
                    item.name = _json.Pension[j].name;
                    item.url = _json.Pension[j].url;
                    this.media.pension.push(item);
                }
            }

            if(_json.GI && _json.GI.length > 0) {
                for (let k = 0; k < _json.GI.length; k++) {
                    let item = new FileData();
                    item.name = _json.GI[k].name;
                    item.url = _json.GI[k].url;
                    this.media.gi.push(item);
                }
            }
            if(_json.Life && _json.Life.length > 0) {
                for (let l = 0; l < _json.Life.length; l++) {
                    let item = new FileData();
                    item.name = _json.Life[l].name;
                    item.url = _json.Life[l].url;
                    this.media.life.push(item);
                }
            }

        }
    }
}

export class DocumentMediaSerializer {

    toJson(obj: DocumentMediaReq): any {
        console.log('DocumentMediaSerializer toJson -> ', obj);
        return obj;
    }

    fromJson(json: any): DocumentMediaResp {
        console.log('DocumentMediaSerializer fromJson -> ', json);
        let response = new DocumentMediaResp(json);
        return response;
    }
}