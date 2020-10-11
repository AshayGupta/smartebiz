export class UserDetails {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    idType: string;
    idValue: string;
    isdCode: string;
    mobile: string;
    nationalId: string;
    nationalIdType: string;

    constructor(userDetails?) {
        if (userDetails) {
            this.firstName = userDetails.firstName;
            this.lastName = userDetails.lastName;
            this.email = userDetails.emailAddress;
            this.idType = userDetails.idType;
            this.middleName = userDetails.middleName;
            this.idValue = userDetails.idValue;
            this.isdCode = userDetails.isdCode;
            this.mobile = userDetails.phoneNo;
            this.nationalId = userDetails.nationalId;
            this.nationalIdType = userDetails.nationalIdType;
        }
    }
}