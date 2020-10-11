import { ApiResource } from "../common/interfaces/serializer";

export class BankList {
  bankCode: string;
  bankName: string;

  constructor(json?: any) {
    if (json) {
      this.bankCode = json.bankCode;
      this.bankName = json.bankName;
    }
  }
}

export class BankListReq {
  lobSrc: string;
  countryCode: string;
}

export class BankListResp extends ApiResource {
  bankList: BankList[] = [];

  constructor(json?: any) {
    super(json);

    if (json) {
      let _json = json.data;
      
      for (var i = 0; i < _json.length; i++) {
        let lists = new BankList(_json[i]);
        this.bankList.push(lists);
      }
    }
  }
}

export class BankListSerializer {

  toJson(obj: BankListReq): any {
    console.log('BankListSerializer toJson -> ', obj);
    return {
      lobSrc: obj.lobSrc,
      countryCode: obj.countryCode
    };
  }

  fromJson(json: any): BankListResp {
    console.log('BankListSerializer fromJson -> ', json);
    let response = new BankListResp(json);
    return response;
  }
}
