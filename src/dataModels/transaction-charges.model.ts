import { ApiResource } from "../common/interfaces/serializer";

export class TransactionChargesReq {
  lobSrc: string;
  clientCode: string;
  transactionType: string;
  amount: string;
  payoutMethod: string;
  payoutMethodName: string;
  fundCode:string;

}

export class TransactionChargesResp extends ApiResource {

  doubleWithdrawalCharge: string;
  initialFees: string;
  fundTransfer: string;
  // locking: boolean = false;

  constructor(json?: any) {
    super(json);
    if (json) {
      let _json = json.data;
      this.doubleWithdrawalCharge = _json.doubleWithdrawalCharge?_json.doubleWithdrawalCharge:"0";
      this.initialFees = _json.initialFees?_json.initialFees:"0";;
      this.fundTransfer = _json.fundTransfer?_json.fundTransfer:"0";;
    }

  }
}

export class TransactionChargesSerializer {

  toJson(obj: TransactionChargesReq): any {
    console.log('TransactionChargesSerializer toJson -> ', obj);
    return {
      lobSrc: obj.lobSrc,
      clientCode: obj.clientCode,
      transactionType: obj.transactionType,
      amount:obj.amount,
      payoutMethod:obj.payoutMethod,
      payoutMethodName:obj.payoutMethodName,
      fundCode:obj.fundCode

    };
  }

  fromJson(json: any): TransactionChargesResp {
    console.log('TransactionChargesSerializer fromJson -> ', json);
    let response = new TransactionChargesResp(json);
    return response;
  }
}
