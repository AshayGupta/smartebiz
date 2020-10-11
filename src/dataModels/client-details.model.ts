import { ApiResource } from "../common/interfaces/serializer";
import { AccountDetails, Caption } from "./account-details.model";

export class Addresses {
    addressNumber: string;
    city: string;
    country: string;
    postalAddress: string;
    postalCode: string;

    constructor(json) {
        this.addressNumber = json.addressNumber;
        this.city = json.city;
        this.country = json.country;
        this.postalAddress = json.postalAddress;
        this.postalCode = json.postalCode;
    }
}

export class BankAccounts {
    accountName: string;
    accountNumber: string;
    accountNumberId: string;
    accountType: string;
    bankNumber: string;
    bankBranch: string;
    bankName: string;
    currencyShortCode: string;

    constructor(json) {
        this.accountName = json.accountName;
        this.accountNumber = json.accountNumber;
        this.accountNumberId = json.accountNumberId;
        this.accountType = json.accountType;
        this.bankNumber = json.bankNumber;
        this.bankBranch = json.bankBranch;
        this.bankName = json.bankName;
        this.currencyShortCode = json.currencyShortCode;
    }
}

export class Contacts {
    contact: string;
    contactNumber: string;
    contactType: string;
    mobile: string;
    email: string;

    constructor(json) {
        this.contact = json.contact;
        this.contactNumber = json.contactNumber;
        this.contactType = json.contactType;
        this.mobile = json.mobileNumber;
        this.email = json.email;
    }
}

export class ClientDetailsReq {
    nationalIdNumber: string;
    lobSrc: string;
    formatted: boolean = false;
}

export class ClientDetailsResp extends ApiResource {
    addresses: Addresses[] = [];
    bankAccounts: BankAccounts[] = [];
    contacts: Contacts[] = [];
    clientDetails = [];
    bankAccountsDetails = [];

    ageAdmitted: string;
    contactMode: string;
    dateOfBirth: string;
    deathAdmited: string;
    firstName: string;
    gender: string;
    initials: string;
    institution: string;
    lastReviewDate: string;
    lobSrc: string;
    maritalStatus: string;
    nationalIdNumber: string;
    nationality: string;
    occupation: string;
    otherReferenceNumber: string;
    passportNumber: string;
    payrollNumber: string;
    personColourScheme: string;
    personNo: string;
    personStatus: string;
    pinNumber: string;
    salutation: string;
    sendSMS: string;
    smoker: string;
    surname: string;
    middleName: string;
    contactId: string;

    data: any;

    constructor(json?: any) {
        super(json);

        if (!json || !json.data) return this.data = json;

        let _json = json.data[0];
        if (_json) {
            this.data = true;
            let _addresses = _json.addresses;
            let _contacts = _json.contacts;
            let _bankAccounts = _json.bankAccounts;

            if (_addresses && _addresses.length > 0) {
                for (var i = 0; i < _addresses.length; i++) {
                    let address = new Addresses(_addresses[i]);
                    this.addresses.push(address);
                }
            }
            if (_bankAccounts && _bankAccounts.length > 0) {
                for (var j = 0; j < _bankAccounts.length; j++) {
                    let accounts = new BankAccounts(_bankAccounts[j]);
                    this.bankAccounts.push(accounts);
                }
            }
            if (_contacts && _contacts.length > 0) {
                for (var z = 0; z < _contacts.length; z++) {
                    let contact = new Contacts(_contacts[z]);
                    this.contacts.push(contact);
                }
            }

            this.ageAdmitted = _json.ageAdmitted;
            this.contactMode = _json.contactMode;
            this.dateOfBirth = _json.dateOfBirth;
            this.deathAdmited = _json.deathAdmited;
            this.firstName = _json.firstName;
            this.gender = _json.gender;
            this.initials = _json.initials;
            this.institution = _json.institution;
            this.lastReviewDate = _json.lastReviewDate;
            this.lobSrc = _json.lobSrc;
            this.maritalStatus = _json.maritalStatus;
            this.nationalIdNumber = _json.nationalIdNumber;
            this.nationality = _json.nationality;
            this.occupation = _json.occupation;
            this.otherReferenceNumber = _json.otherReferenceNumber;
            this.passportNumber = _json.passportNumber;
            this.payrollNumber = _json.payrollNumber;
            this.personColourScheme = _json.personColourScheme;
            this.personNo = _json.personNo;
            this.personStatus = _json.personStatus;
            this.pinNumber = _json.pinNumber;
            this.salutation = _json.salutation;
            this.sendSMS = _json.sendSMS;
            this.smoker = _json.smoker;
            this.surname = _json.surname;
            this.middleName = _json.middleName;
            this.contactId = _json.contactId || "";
        }

        // For AMC Client Details
        let _json1 = json.data;
        if (_json1) {
            this.data = true;
            let _clientDetails = _json1.clientDetails;
            let _bankAccounts = _json1.bankAccounts;

            if (_clientDetails && _clientDetails.length > 0) {
                // let accountDetails: AccountDetails[][] = [];
                // let captions: Caption[] = [];

                // for (var c = 0; c < _clientDetails.length; c++) {
                //     let detailsList: AccountDetails[] = [];
                //     for (var d = 0; d < _clientDetails[c].length; d++) {
                //         let details = new AccountDetails(_clientDetails[c][d]);
                //         detailsList.push(details);
                //         if (c == 0) {
                //             captions.push(details.caption);
                //         }
                //     }
                //     accountDetails.push(detailsList);
                // }

                // this.clientDetails.push(accountDetails);
                // this.clientDetails.push(captions);
                for (let i = 0; i < _clientDetails.length; i++) {
                    let details = new AccountDetails(_clientDetails[i]);
                    this.clientDetails.push(details);
                }
            }

            if (_bankAccounts && _bankAccounts.length > 0) {
                let accountDetails: AccountDetails[][] = [];
                let captions: Caption[] = [];

                for (var c = 0; c < _bankAccounts.length; c++) {
                    let detailsList: AccountDetails[] = [];
                    for (var d = 0; d < _bankAccounts[c].length; d++) {
                        let details = new AccountDetails(_bankAccounts[c][d]);
                        detailsList.push(details);
                        if (c == 0) {
                            captions.push(details.caption);
                        }
                    }
                    accountDetails.push(detailsList);
                }

                this.bankAccountsDetails.push(accountDetails);
                this.bankAccountsDetails.push(captions);
            }

        }
    }
}

export class ClientDetailsSerializer {

    toJson(obj: ClientDetailsReq): any {
        console.log('ClientDetailsSerializer toJson -> ', obj);
        return {
            nationalIdNumber: obj.nationalIdNumber,
            lobSrc: obj.lobSrc,
            formatted: obj.formatted
        };
    }

    fromJson(json: any): ClientDetailsResp {
        console.log('ClientDetailsSerializer fromJson -> ', json);
        let response = new ClientDetailsResp(json);
        return response;
    }
}