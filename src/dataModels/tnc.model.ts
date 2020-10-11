import { ApiResource } from "../common/interfaces/serializer";


export class TnCRequestReq {
  lobSrc: string;
  transactionType: string;
}

export class TnCRequestResp extends ApiResource {
  lobSrc: string;
  transactionType: string;
  terms: string;

  constructor(json?: any) {
    super(json);
    if (json) {
      let _json = json.data;
      this.lobSrc = _json.lobSrc;
      this.transactionType = _json.transactionType;
      this.terms = _json.terms;
    }
  }
}

export class TnCRequestSerializer {

  toJson(obj: TnCRequestReq): any {
    console.log('TnCSerializer toJson -> ', obj);
    return {
      lobSrc: obj.lobSrc,
      transactionType: obj.transactionType
    };
  }

  fromJson(json: any): TnCRequestResp {
    console.log('TnCRequestSerializer fromJson -> ', json);
    let response = new TnCRequestResp(json);
    return response;
  }
}
