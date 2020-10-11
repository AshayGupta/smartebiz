import { ApiResource } from "../common/interfaces/serializer";

export class UploadDocumentReq {
    fileBase64String: string;
    folderName: string;
    fileName: string;
    mimeType: string;
    userid: string;
    idType: string;
    idValue: string;
    personType: string;
    transactionType: string;
    transactionNumber: string;
    policyNo: string;
    lob: string;
    category: string;
    product: string;
    docType:string;
    filePath: string;
}

export class UploadDocument {
    id: string;
    url: string;
}

export class UploadDocumentResp extends ApiResource {
    data: UploadDocument;

    constructor(json: any) {
        super(json);

        if (!json.data) return;
        let _json = json.data;

        let obj = new UploadDocument();
        obj.id = _json.dlFileEntryId;
        obj.url = _json.url;

        this.data = obj;
    }
}

export class UploadDocumentSerializer {

    toJson(obj: UploadDocumentReq): any {
        console.log('UploadDocumentSerializer toJson -> ', obj);
        return obj;
    }

    fromJson(json: any): UploadDocumentResp {
        console.log('UploadDocumentSerializer fromJson -> ', json);
        let response = new UploadDocumentResp(json);
        return response;
    }
}
