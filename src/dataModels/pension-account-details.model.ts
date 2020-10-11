import { ApiResource } from "../common/interfaces/serializer";
import { AccountDetails, AccountDetailReq } from "./account-details.model";
import { Utils } from "../common/utils/utils";

export class PensionAccountDetailsReq {
    accountDetailReq: AccountDetailReq = new AccountDetailReq();
}

export class PensionDetailsObj {
    company_name: string;
    date_joined_scheme: string;
    dob: string;
    first_name: string;
    gender: string;
    id: string;
    id_no: string;
    id_type: string;
    last_amount_paid: string;
    last_date_paid: string;
    member_number: string;
    membership_status: string;
    other_names: string;
    pin: string;
    retirementAge: string;
    retirementDate: string;
    scheme_id: string;
    scheme_name: string;
    sposor_name: string;
    sur_name: string;
}

export class PensionAccountDetailsResp extends ApiResource {
    accountDetails: AccountDetails[] = [];
    pensionDetailsObj: PensionDetailsObj;

    constructor(json?: any) {
        super(json);

        if (json && json.data) {
            let _json = json.data;

            if (Array.isArray(_json)) {
                for(var i=0; i<_json.length; i++) {
                    let details = new AccountDetails(_json[i]);
                    this.accountDetails.push(details);
                }
            }
            else {
                this.pensionDetailsObj = new PensionDetailsObj();

                this.pensionDetailsObj.id = _json.id;
                this.pensionDetailsObj.first_name = _json.first_name;
                this.pensionDetailsObj.other_names = _json.other_names;
                this.pensionDetailsObj.sur_name = _json.sur_name
                this.pensionDetailsObj.dob = Utils.formatDateYYDDMM(_json.dob);
                this.pensionDetailsObj.pin = _json.pin;
                this.pensionDetailsObj.gender = _json.gender;
                this.pensionDetailsObj.member_number = _json.member_number;
                this.pensionDetailsObj.date_joined_scheme = _json.date_joined_scheme;
                this.pensionDetailsObj.membership_status = _json.membership_status;
                this.pensionDetailsObj.id_no = _json.id_no;
                this.pensionDetailsObj.id_type = _json.id_type;
                this.pensionDetailsObj.scheme_id = _json.scheme_id;
                this.pensionDetailsObj.scheme_name = _json.scheme_name;
                this.pensionDetailsObj.sposor_name = _json.sposor_name;
                this.pensionDetailsObj.company_name = _json.company_name;
                this.pensionDetailsObj.last_date_paid = _json.last_date_paid;
                this.pensionDetailsObj.retirementDate = _json.retirementDate;
                this.pensionDetailsObj.retirementAge = _json.retirementAge;
                this.pensionDetailsObj.last_amount_paid = _json.last_amount_paid;
            }

        }
    }
}

export class PensionAccountDetailsSerializer {

    toJson(obj: PensionAccountDetailsReq): any {
        console.log('PensionAccountDetailsSerializer toJson -> ', obj);
        return {
            accountNumber: obj.accountDetailReq.accountNumber,
            formatted: obj.accountDetailReq.formatted,
            LobSrc: obj.accountDetailReq.lobSrc
        };
    }

    fromJson(json: any): PensionAccountDetailsResp {
        console.log('PensionAccountDetailsSerializer fromJson -> ', json);
        let response = new PensionAccountDetailsResp(json);
        return response;
    }
}
