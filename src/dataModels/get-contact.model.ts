import { ApiResource } from './../common/interfaces/serializer';

export class Contacts {
  contact: string;
  contactType: string;
  clientCode: string;
  mobileNumber: string;
  email: string;
  contactNumber: string;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}
export class ContactReq {
  lobSrc: string;
  systemCode: string;
  clientSystemCode: string;
  transactionNumber: string;
  countryCode: string;
  siteAgentNumber: string;
  personNumber: string;
  personType: string;
  nationalIdNumber: string;
  contacts: Contacts;
}

export class ContactDetail {
  mobileNumber: string;
  lobSrc: string;
  actionsheetText: string;
}

export class ContactResp extends ApiResource {
  contacts: ContactDetail[] = [];

  constructor(json?: any) {
    super(json);
    if (json) {
      if (!json.data) return;
      
      let _json = json.data;
      for (let i = 0; i < _json.contacts.length; i++) {
        let contact = new ContactDetail();
        contact.mobileNumber = _json.contacts[i].mobileNumber;
        contact.actionsheetText = _json.contacts[i].mobileNumber;
        contact.lobSrc = _json.contacts[i].lobSrc;

        if(i === 0) {
          this.contacts.push(contact);
        }
        else {
          this.contacts.filter(item => {
            if(item.mobileNumber != contact.mobileNumber) {
              this.contacts.push(contact);
            }
          })
        }
      }
    }
  }
}

export class ContactSerializer {

  toJson(obj: ContactReq): any {
    console.log('ContactSerializer toJson -> ', obj);
    return obj;
  }
  fromJson(json: any): ContactResp {
    console.log('ContactSerializer fromJson -> ', json);
    let response = new ContactResp(json);
    return response;
  }
}
