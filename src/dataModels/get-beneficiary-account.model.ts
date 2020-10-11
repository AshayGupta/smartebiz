import { Beneficiary } from './beneficiary.model';
import { ApiResource } from "../common/interfaces/serializer";
import { Nominee } from './nominee.model';

export class BeneficiaryAccountReq {
    LobSrc: string;
    memberId: string;
}

export class Beneficiaries {
    beneficiary: Beneficiary;
    nominee: Nominee;
    dateImported: string;
    action: string;
    index: number;
}

export class BeneficiaryAccountResp extends ApiResource {
    policyNumber: string;
    productName: string;
    nationalId: string;

    beneficiaries: Beneficiaries[] = [];
    dateImported: string;

    constructor(json?: any) {
        super(json);

        if (json) {
            let _json = json.data[0];

            if (_json.beneficiaries_details && Array.isArray(_json.beneficiaries_details)) {
                let beneficiaryDetails:Array<any> = _json.beneficiaries_details;

                this.beneficiaries = [];

                for(let i=0; i < beneficiaryDetails.length; i++) {
                    let benef = new Beneficiaries();
                    benef.beneficiary = new Beneficiary(beneficiaryDetails[i]);
                    benef.nominee = new Nominee(beneficiaryDetails[i].nominee_details);

                    this.beneficiaries.push(benef);
                }
            }
            else if (_json.beneficiaries_details && !Array.isArray(_json.beneficiaries_details)) {
                let beneficiaryDetails:Array<any> = [];
                beneficiaryDetails.push(_json.beneficiaries_details);
                
                this.beneficiaries = [];

                for(let i=0; i < beneficiaryDetails.length; i++) {
                    let benef = new Beneficiaries();
                    benef.beneficiary = new Beneficiary(beneficiaryDetails[i]);
                    benef.nominee = new Nominee(beneficiaryDetails[i].nominee_details);

                    this.beneficiaries.push(benef);
                }
            }
            
            this.nationalId = _json.nationalId;
            this.dateImported = _json.dateImported;
        }

    }
}

export class BeneficiaryAccountSerializer {  

    toJson(obj: BeneficiaryAccountReq): any {
        console.log('BeneficiaryAccountSerializer toJson -> ', obj);
        return obj;
    }

    fromJson(json: any): BeneficiaryAccountResp {
        console.log('BeneficiaryAccountSerializer fromJson -> ', json);
        let response = new BeneficiaryAccountResp(json);
        return response;
    }
}