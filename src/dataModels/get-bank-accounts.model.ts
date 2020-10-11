import { ApiResource } from "../common/interfaces/serializer";

export class BankAccountsList {
    accountNumberId: string;
    accountNumber: string;
    accountName: string;
    accountType: string;
    bankNumber: string;
    bankName: string;
    bankBranch: string;

    constructor(json) {
        this.accountNumberId = json.accountNumberId;
        this.accountName = json.accountName;
        this.accountNumber = json.accountNumber;
        this.accountType = json.accountType;
        this.bankNumber = json.bankNumber;
        this.bankName = json.bankName;
        this.bankBranch = json.bankBranch;
    }
}

export class BankAccountsReq {
    lobSrc: string
    systemCode: string
    transactionNumber: string
    countryCode: string
    siteAgentNumber: string
    personNumber: string
    accountNumberId: string
    accountNumber: string
    accountName: string
    bankNumber: string
    mobileNumber: string
    policyNumber: string
    nationalIdNumber: string
    pinNumber: string
    systemClientCode: string
}

export class BankAccountsResp extends ApiResource {
    personNo: string;
    bankAccountsList: BankAccountsList[] = [];

    constructor(json: any) {
        super(json);

        let _json = json.data
        let _bankAccounts = _json.bankAccounts;
        for (var i = 0; i < _bankAccounts.length; i++) {
            let lists = new BankAccountsList(_bankAccounts[i]);
            this.bankAccountsList.push(lists);
        }

        this.personNo = _json.personNo;
    }
}

export class BankAccountsSerializer {

    toJson(obj: BankAccountsReq): any {
        console.log('BankAccountsSerializer toJson -> ', obj);
        return {
            lobSrc: obj.lobSrc,
            systemCode: obj.systemCode,
            transactionNumber: obj.transactionNumber,
            countryCode: obj.countryCode,
            siteAgentNumber: obj.siteAgentNumber,
            personNumber: obj.personNumber,
            accountNumberId: obj.accountNumberId,
            accountNumber: obj.accountNumber,
            accountName: obj.accountName,
            bankNumber: obj.bankNumber,
            mobileNumber: obj.mobileNumber,
            policyNumber: obj.policyNumber,
            nationalIdNumber: obj.nationalIdNumber,
            pinNumber: obj.pinNumber,
            systemClientCode: obj.systemClientCode,
        };
    }

    fromJson(json: any): BankAccountsResp {
        console.log('BankAccountsSerializer fromJson -> ', json);
        let response = new BankAccountsResp(json);
        return response;
    }
}
