import { ApiResource } from "../common/interfaces/serializer";


export class ServiceHistoryList {
    policyNo: string;
    email: string;
    srNumber: string;
    srStatus: string;
    subStatus: string;
    srType: string;
    firstName: string;
    lastName: string;
    accountName: string;
    summary: string;
    phoneNumber: string;
    contactId: string;
    closeDate: string;

    owner: string;
    category: string;
    subCategory: string;
    requestNo: string;
    commMethod: string;
    collection: string;
    hospitalName: string;
    lob: string;
    startStamp: string;
    
    constructor(json?: any) {
        if (json) {

            this.startStamp = json.startStamp;
            let jsonReq = json.request;

            this.owner = jsonReq.Owner
            this.category = jsonReq.Category
            this.subCategory = jsonReq['Sub-Category']
            this.summary = jsonReq.Summary
            this.requestNo = jsonReq.Id
            this.commMethod = jsonReq.CommMethod
            this.collection = jsonReq.collection
            this.hospitalName = jsonReq.HospitalName
            this.lob = jsonReq.Lob;
            this.srStatus = jsonReq.SRStatus;
            this.policyNo = jsonReq.PolicyNumber;

            let jsonResp = json.response;
            if (jsonResp.ListOfServiceRequestsResponse) {
                if (jsonResp.ListOfServiceRequestsResponse.ServiceRequestResponse) {
                    this.srNumber = jsonResp.ListOfServiceRequestsResponse.ServiceRequestResponse[0].SRNumber;
                }
            }

            // this.policyNo = json.policyNo;
            // this.email = json.email;
            // this.srNumber = json.SRNumber;
            // this.srStatus = json.Status;
            // this.subStatus = json['Sub-Status'];
            // this.srType = json.SRType;
            // this.firstName = json.firstName;
            // this.lastName = json.lastName;
            // this.accountName = json.accountName;
            // this.summary = json.summary;
            // this.phoneNumber = json.phoneNumber;
            // this.contactId = json.contactId;
            // this.closeDate = json.closeDate;

        }
    }
}

export class ServiceHistoryReq {
    nationalId: string;
    nationalIdType: string;
    // lobSrc: string;
    // SRNumber: string;
    // nationalIdNumber: string;
    // passportNumber: string;
    // firstName: string;
    // middleName: string;
    // surname: string;
    // policyNo: string;
    // email: string;
    // contactId: string;
}

export class ServiceHistoryResp extends ApiResource {
    serviceHistoryList: ServiceHistoryList[] = [];

    constructor(json?: any) {
        super(json);

        if (json) {
            let _json = json.data

            for (var i = 0; i < _json.length; i++) {
                let item = new ServiceHistoryList(_json[i]);
                this.serviceHistoryList.push(item);
            }
        }

    }
}

export class ServiceHistorySerializer {

    toJson(obj: ServiceHistoryReq): any {
        console.log('ServiceHistorySerializer toJson -> ', obj);
        return obj;
    }

    fromJson(json: any): ServiceHistoryResp {
        console.log('ServiceHistorySerializer fromJson -> ', json);
        let response = new ServiceHistoryResp(json);
        return response;
    }
}