import { ApiResource } from './../common/interfaces/serializer';

export class GetPdfFileAsBase64Req {
  transactionNumber: string;
  docType: string;
}

export class Attachment {
  fileName:string;
  base64String:string;
  mimeType: string;
}


export class GetPdfFileAsBase64Resp extends ApiResource {
  attachmentArray: Attachment[] = [];

  constructor(json?: any) {
    super(json);

    if (json) {
      let _json = json.data;

      if (_json &&  _json.allDoc && _json.allDoc.length > 0) {
        _json.allDoc.filter(item => {
          let obj = new Attachment();

          obj.fileName = item.fileName;
          obj.base64String = item.base64String;
          obj.mimeType = item.mimeType;

          this.attachmentArray.push(obj);
        });
      }
      else {
        let obj = new Attachment();

          obj.fileName = _json.fileName;
          obj.base64String = _json.base64String;
          obj.mimeType = _json.mimeType;

          this.attachmentArray.push(obj);
      }
    }
  }
}

export class GetPdfFileAsBase64Serializer {

  toJson(obj: GetPdfFileAsBase64Req): any {
    console.log('GetPdfFileAsBase64Serializer toJson -> ', obj);
    return obj;
  }

  fromJson(json: any): GetPdfFileAsBase64Resp {
    console.log('GetPdfFileAsBase64Serializer fromJson -> ', json);
    let response = new GetPdfFileAsBase64Resp(json);
    return response;
  }
}
