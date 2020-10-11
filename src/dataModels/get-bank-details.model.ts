import { ApiResource } from "../common/interfaces/serializer";

export class BankDetailList {
  code: string;
  description: string;
  extraAttribute: string;

    constructor(json?: any) {
      if (json) {
        this.code = json.code;
        this.description = json.description;
        this.extraAttribute = json.extraAttribute;
      }
    }
}

export class BankDetailsReq {
    lobSrc: string
    filterValue: string
    systemCode: string
    countryCode: string
    transactionNumber: string
    siteAgentNumber: string
    policyStatus: string
    listType: string
}

export class BankDetailsResp extends ApiResource {
    listType: string;
    bankDetailList: BankDetailList[] = [];

    constructor(json?: any) {

      super(json);
      if (json) {

        let _json = json.data;
        let _bankDetails = _json[0].items;
        for (var i = 0; i < _bankDetails.length; i++) {
            let lists = new BankDetailList(_bankDetails[i]);
            this.bankDetailList.push(lists);
        }

        this.listType = _json[0].listType;
      }
    }
}

export class BankDetailsSerializer {

    toJson(obj: BankDetailsReq): any {
        console.log('BankDetailsSerializer toJson -> ', obj);
        return {
            lobSrc: obj.lobSrc,
            systemCode: obj.systemCode,
            transactionNumber: obj.transactionNumber,
            countryCode: obj.countryCode,
            siteAgentNumber: obj.siteAgentNumber,
            filterValue: obj.filterValue,
            policyStatus: obj.policyStatus,
            listType: obj.listType
        };
    }

    fromJson(json: any): BankDetailsResp {
        console.log('BankDetailsSerializer fromJson -> ', json);
        let response = new BankDetailsResp(json);
        return response;
    }
}
