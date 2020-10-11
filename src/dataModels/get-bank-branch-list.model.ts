import { ApiResource } from "../common/interfaces/serializer";

export class BranchList {
  branchName: string;
  bankCode: string;
  countryCode: string;

  constructor(json?: any) {
    if (json) {
      this.bankCode = json.bankCode;
      this.branchName = json.branchName;
      this.countryCode = json.countryCode;
    }
  }
}

export class BranchListReq {
  lobSrc: string;
  bankCode: string;
  countryCode: string;
}

export class BranchListResp extends ApiResource {
  branchList: BranchList[] = [];

  constructor(json?: any) {

    super(json);
    if (json) {

      let _json = json.data;
      for (var i = 0; i < _json.length; i++) {
        let lists = new BranchList(_json[i]);
        this.branchList.push(lists);
      }
    }
  }
}

export class BranchListSerializer {

  toJson(obj: BranchListReq): any {
    console.log('BranchListSerializer toJson -> ', obj);
    return {
      lobSrc: obj.lobSrc,
      countryCode: obj.countryCode,
      bankCode: obj.bankCode
    };
  }

  fromJson(json: any): BranchListResp {
    console.log('BranchListSerializer fromJson -> ', json);
    let response = new BranchListResp(json);
    return response;
  }
}
