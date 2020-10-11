import { UserDetails } from './user-details.model';
import { ApiResource } from "../common/interfaces/serializer";
import { TermAndCondition, Stages, OtpVerification } from './amc-mongo-stages.model';
import { Beneficiary } from './beneficiary.model';
import { Nominee } from './nominee.model';
import { Beneficiaries } from './get-beneficiary-account.model';

export class AddBeneficiaryReq {
    mongoId: string;
    transactionNumber: string;
    collection: string;
    userDetails: UserDetails;
    ODSData: Beneficiaries[];
    dateImported: string;
    TermAndCondition: TermAndCondition;
    SR_Number: string;
    stages: Stages[];
    PolicyDetails: {
        policyNo: string;
    };
    UpdateODSData: Beneficiaries[];
    isUpdate: string;
    OTPData: OtpVerification[];
    channel: string;
    source: string;
    transactionId: string;
    TargetLob: string;
}


export class AddBeneficiaryResp extends ApiResource {

    constructor(json?: any) {
        super(json);

        if (json) {
            let _json = json.data;
        }

    }
}

export class AddBeneficiarySerializer {  

    toJson(obj: AddBeneficiaryReq): any {
        console.log('AddBeneficiarySerializer toJson -> ', obj);
        return obj;
    }

    fromJson(json: any): AddBeneficiaryResp {
        console.log('AddBeneficiarySerializer fromJson -> ', json);
        let response = new AddBeneficiaryResp(json);
        return response;
    }
}