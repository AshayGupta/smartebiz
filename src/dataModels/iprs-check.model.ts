import { ApiResource } from './../common/interfaces/serializer';

export class IprsReq {
  lobSrc: string;
  firstName: string;
  middleName: string;
  lastName: string;
  clientIdentifierType: string;
  identificationNumber: string;
}

export class IprsResp extends ApiResource {
  isIprsUp: string;
  comparisionRate: string;
  proceedFlag: string;
  message: string;

  constructor(json?: any) {
    super(json);

    if (json) {
      let _json = json.data;
      this.isIprsUp = _json.isIprsUp;
      this.comparisionRate = _json.comparisionRate;
      this.proceedFlag = _json.proceedFlag;
      this.message = _json.message;
    }
  }
}

export class IprsSerializer {
  toJson(obj:IprsReq):any{
    console.log("IprsSerializer toJson -> ",obj);
    return obj;
  }
  fromJson(json:any):IprsResp{
    console.log("IprsSerializer fromJson -> ",json)
    let response=new IprsResp(json);
    return response;
  }
}
