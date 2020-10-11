import { ApiResource } from "../common/interfaces/serializer";

export class ViewHistoryReq {
    lobSrc: string;
    SRNumber: string;
}

export class data{
    SRNumber: string;
    summary: string;
    status: string;

}

export class ViewHistoryResp extends ApiResource {

    return:data[]=[];

    
    constructor(json?: any) {
        super(json);
        if (json && json.data && json.data.return) {
            let _json = json.data;
            for (var i = 0; i < _json.return.length; i++) {
                let item = new data();
                item.SRNumber = _json.return[i].SRNumber;
                item.status = _json.return[i].status;
                item.summary = _json.return[i].summary;

                this.return.push(item);
            }
            // this.SRNumber = _json.SRNumber;
            // this.summary = _json.summary;
            // this.status = _json.status;
        }
    }
}

export class ViewHistorySerializer {
    toJson(obj: ViewHistoryReq): any {
        console.log('ViewHistorySerializer toJson -> ', obj);
        return {
            lobSrc: obj.lobSrc,
            SRNumber: obj.SRNumber
        };
    }
    fromJson(json: any): ViewHistoryResp {
        console.log('ViewHistorySerializer fromJson -> ', json);
        let response = new ViewHistoryResp(json);
        return response;
    }
}