import { FileAttachmentReq } from './file-attachment.model';
import { ApiResource } from "../common/interfaces/serializer";
import { CategoryMatrix } from './category-matrix.model';
import { UserDetails } from './user-details.model';


export class RaiseServiceRequestReq {
    autoIncID: string;
    category: CategoryMatrix;
    policyNo: string;
    subCategory: string;
    message: string;
    userDetails = new UserDetails();
    hospitalName: string;
    dateOfAdmission: string;
    // SRStatus: string = 'Open';
    commMethod: string;
    contactId: string;
    fileAttachment: FileAttachmentReq[] = [];
    attachment: any;
}

export class RaiseServiceRequestResp extends ApiResource {
    id: string;
    srNumber: string;
    modId: string;

    constructor(json?: any) {
        super(json);

        if (json) {
            let _json = json.data.ListOfServiceRequestsResponse;
            if (!_json) return;

            let j =_json.ServiceRequestResponse[0];
            this.id = j.Id;
            this.modId = j.ModId;
            this.srNumber = j.SRNumber;
        }

    }
}

export class RaiseServiceRequestSerializer {

    toJson(obj: RaiseServiceRequestReq): any {
        console.log('ServiceRequestSerializer toJson -> ', obj);
        if (obj.category.lob == 'Retail Pension') {
            obj.policyNo = ''
        };
        return {
            Id: obj.autoIncID,
            Company: obj.category.company,
            LOB: obj.category.lob,
            Category: obj.category.category,
            'Sub-Category': obj.category.subCategory,
            HospitalName: obj.hospitalName,
            DateOfAdmission: obj.dateOfAdmission,
            Summary: obj.message,
            SRStatus: obj.category.srstatus,
            CommMethod: obj.commMethod,
            Owner: obj.category.owner,
            PolicyNumber: obj.policyNo, //obj.policyNo.accountNumber,
            userDetails: {
                idType: obj.userDetails.idType,
                idValue: obj.userDetails.idValue
            },
            srAttachments: obj.attachment,
            Source: obj.category.source,
            contactId: obj.contactId
        };
    }

    fromJson(json: any): RaiseServiceRequestResp {
        console.log('RaiseServiceRequestSerializer fromJson -> ', json);
        let response = new RaiseServiceRequestResp(json);
        return response;
    }
}
