import { CategoryMatrix } from './category-matrix.model';
import { ApiResource } from "../common/interfaces/serializer";


export class CreateSrPdfReq {
  jsonArray: any[];
  clientDetailsJson: any;
  type: string;
  policyNo: string;
  folderName: string;
  userid: string;
  idType: string;
  idValue: string;
  personType: string;
  transactionType: string;
  transactionNumber: string;
  lob: string;
  category: string;
  product: string;
}

export class ClientDetailsJson {
  date: string;
  customerName: string;
  transactionId: string;
  policyNumber: string;
  amount: string;
  personStatus:string;
  occupation:string;
  gender:string;
  pinNumber:string;
  dateOfBirth:string;
  taxStatus:string;
  firstName:string;
  nationality:string;
  systemcode:string;
  surname:string;
  nationalIdNumber:string;
  middleName:string
  salutation:string;
}
export class JsonArray{
  transactionType:string;
  holdingAmount:string;
  amount:string;
  fundCode:string;
  paymentMode:string;
  clientCode:string;
  paymentBankCode:string;
  branchName:string;
  bankAccountNo:string;
  bankName:string;
  accountNumber:string;
  fundName:string;
  accountHolderName:string;
  otp:string;
  otpMobileNo:string;

}
export class CreateSrPdfResp extends ApiResource {
  dlFileEntryId: string;
  message: string;
  url: string;
  status: string

  constructor(json?: any) {
    super(json);

    if (json) {
      let _json = json.data;
      if (_json) {
        this.dlFileEntryId = _json.dlFileEntryId;
        this.message = _json.message;
        this.url = _json.url;
        this.status = _json.statusCode;
      }

    }

  }
}

export class CreateSrPdfSerializer {

  toJson(obj: CreateSrPdfReq): any {
    console.log('CreateSrPdfSerializer toJson -> ', obj);
    return {
      jsonArray: JSON.stringify(obj.jsonArray),
      clientDetailsJson: JSON.stringify(obj.clientDetailsJson),
      type: obj.type,
      policyNo: obj.policyNo,
      folderName: obj.folderName,
      userid: obj.userid,
      idType: obj.idType,
      idValue: obj.idValue,
      personType: obj.personType,
      transactionType: obj.transactionType,
      transactionNumber: obj.transactionNumber,
      lob: obj.lob,
      category: obj.category,
      product: obj.product
    };
  }

  fromJson(json: any): CreateSrPdfResp {
    console.log('CreateSrPdfSerializer fromJson -> ', json);
    let response = new CreateSrPdfResp(json);
    return response;
  }
}
