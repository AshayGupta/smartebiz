import { Utils } from "./../common/utils/utils";

export class Nominee {
  personNumber: string;
  firstName: string;
  middleName: string;
  mobileNO: string;
  email: string;
  lastName: string;
  gender: string;
  birthDate: string;
  relationshipCode: string;
  benefitNumber: string;
  benefitOrder: string;
  clause: string;
  relationshipType: string;
  lumpsum_entitlement: string
  percentage: string;
  uploadDocuments: Array<any> = [];
  documentType: string;
  documentNumber: string;
  passportNo: string;
  applicationNo: string;
  nationalIdNumber: string;
  photoNo: string;
  birthCertificateNumber: string;

  constructor(json?: any) {
    if (json) {
      this.personNumber = json.personNumber || "";
      this.firstName = json.guardian_fn || "";
      this.middleName = json.guardian_on || "";
      this.lastName = json.guardian_sn || "";
      this.mobileNO = json.guardian_phone || "";
      this.email = json.email || "";
      this.gender = json.guardian_gender || "";
      // this.birthDate = Utils.DDMMYYYYIntoYYYYMMDD(json.birthDate) || "";
      this.birthDate = json.birthDate || "";
      this.relationshipCode = json.relationshipCode || "";
      this.benefitNumber = json.benefitNumber || "";
      this.benefitOrder = json.benefitOrder || "";
      this.clause = json.clause || "";
      this.lumpsum_entitlement = json.lumpsum_entitlement || "";
      this.percentage = json.lumpsum_entitlement || "";
      this.relationshipType = json.guardian_relation || "";
      this.nationalIdNumber = json.id_no || "";
      this.birthCertificateNumber = json.birth_cert || "";
      this.passportNo = json.passportNo || "";
      this.applicationNo = json.applicationNo || "";
      this.photoNo = json.photoNo || "";
    }
  }
}
