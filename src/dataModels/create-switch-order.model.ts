import { ApiResource } from '../common/interfaces/serializer';

export class SwitchOrder{
  fundCode: string;
  amtOrUnit: string;
  allOrPartial: string;
  tranAmt: string;
  tranUnit:string;
  debitBankCode: string;
  paymentMode: string;
  settlementBankCode: string;
  dividendOption: string;
  targetFundCode: string;
}

export class CreateSwitchOrderReq {
  lobSrc: string;
  clientCode: string;
  transactionType: string;
  tranType: string;
  switchOrder:SwitchOrder[];
}

export class CreateSwitchOrderResp extends ApiResource {
  orderNo:string;
  successFlag: string;
  message: string;
  constructor(json?: any) {
    super(json)
    if (json) {
      let _json = json.data;
      this.orderNo = _json.orderNo;
      this.successFlag=_json.successFlag;
      this.message = _json.message;
    }
  }
}

export class CreateSwitchOrderSerializer {
  toJson(obj: CreateSwitchOrderReq): any {
    console.log('CreateSwitchOrderSerializer toJson -> ', obj);
    return {
      lobSrc: obj.lobSrc,
      clientCode: obj.clientCode,
      transactionType: obj.transactionType,
      tranType: obj.tranType,
      switchOrder:obj.switchOrder
    };
  }

  fromJson(json: any): CreateSwitchOrderResp {
    console.log('CreateSwitchOrderSerializer fromJson -> ', json);
    let response = new CreateSwitchOrderResp(json);
    return response;
  }
}
