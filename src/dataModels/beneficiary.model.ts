import { Utils } from './../common/utils/utils';

export class Beneficiary {
    id: string;
    personNumber: string;
    firstName: string;
    middleName: string;
    email: string;
    mobileNo: string;
    lastName: string;
    gender: string;
    birthDate: any;
    age: number;
    relationshipCode: string;
    benefitNumber: string;
    benefitOrder: string;
    clause: string;
    relationshipType: string;
    nationality: string;
    documentType: string;
    documentNumber: string;
    lumpsum_entitlement: string;
    percentage: string;
    action: string;
    uploadDocuments: Array<any> = [];
    passportNo: string;
    applicationNo: string;
    nationalIdNumber: string;
    photoNo: string;
    birthCertificateNumber: string;

    constructor(json?: any) {
        if (json) {
            this.id = json.id || "";
            this.firstName = json.firstname || "";
            this.middleName = json.othernames || "";
            // this.dob = Utils.DDMMYYYYIntoYYYYMMDD(json.dob) || "";
            this.birthDate = json.dob || "";
            this.lumpsum_entitlement = json.lumpsum_entitlement || "";
            this.percentage = json.lumpsum_entitlement || "";
            this.mobileNo = json.cell_phone || "";
            this.relationshipType = json.relationship || "";
            this.lastName = json.surname || "";
            this.gender = json.gender || "";
            this.email = json.email || "";
            this.personNumber = json.personNumber || "";
            // this.age = Utils.getAge(this.birthDate) || "";
            this.relationshipCode = json.relationshipCode || "";
            this.benefitNumber = json.benefitNumber || "";
            this.benefitOrder = json.benefitOrder || "";
            this.clause = json.clause || "";
            this.nationalIdNumber = json.id_no || "";
            this.birthCertificateNumber = json.birth_cert || "";
            this.passportNo = json.passportNo || "";
            this.applicationNo = json.applicationNo || "";
            this.photoNo = json.photoNo || "";
        }
    }
    
}