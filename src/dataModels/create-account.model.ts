import { BankDetail } from './buy-product-model';
import { ApiResource } from '../common/interfaces/serializer';


export class CreateAccountReq {
  lobSrc: string;
  nationalId: string;
  pinNumber: string;
  firstname: string;
  middlename: string;
  lastname: string;
  note: string;
  dateCreated: string;
  iprsVerified: string;
  active: string = "1";
  address: string;
  msisdn: string;
  occupation: string;
  terms: string;
  dateOfBirth: string;
  billReferenceNumber: string;
  source: string;
  email: string;
  clientIdentifierType: string;
  generateAccountCode: string;
  bankDetails: BankDetail[] = [];
}

export class CreateAccountResp extends ApiResource {
  accountID: string;
  accountCode: string;
  message: string;

  constructor(json?: any) {
    super(json)

    if (json) {
      let _json = json.data;
      this.accountID = _json.accountID
      this.accountCode = _json.accountCode;
      this.message = _json.message;
    }
  }
}

export class CreateAccountSerializer {
  toJson(obj: CreateAccountReq): any {
    console.log('CreateAccountSerializer toJson -> ', obj);
    return {
      lobSrc: obj.lobSrc,
      nationalId: obj.nationalId,
      pinNumber: obj.pinNumber,
      firstname: obj.firstname,
      middlename: obj.middlename,
      lastname: obj.lastname,
      note: obj.note,
      dateCreated: obj.dateCreated,
      iprsVerified: obj.iprsVerified,
      active: obj.active,
      address: obj.address,
      msisdn: obj.msisdn,
      occupation: obj.occupation,
      terms: obj.terms,
      dateOfBirth: obj.dateOfBirth,
      billReferenceNumber: obj.billReferenceNumber,
      source: obj.source,
      email: obj.email,
      clientIdentifierType: obj.clientIdentifierType,
      generateAccountCode: obj.generateAccountCode,
      bankDetails: {
        "bank": obj.bankDetails
      }
    };
  }

  fromJson(json: any): CreateAccountResp {
    console.log('CreateAccountSerializer fromJson -> ', json);
    let response = new CreateAccountResp(json);
    return response;
  }
}
