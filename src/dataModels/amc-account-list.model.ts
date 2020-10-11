
export class AmcAccountList {
    accountName: string;
    accountNumber: string;
    accountType: string;
    activeDate: string;
    clientId: string;
    holdingPattern: string;
    jointHolders: string;
    nominees: string;
    reportingEmail: string;
    reportingFax: string;
    startDate: string;
    status: string;
    systemCode: string;

    constructor(json: any) {
        this.accountName = json.accountName;
        this.accountNumber = json.accountNumber;
        this.accountType = json.accountType;
        this.activeDate = json.activeDate;
        this.clientId = json.clientId;
        this.holdingPattern = json.holdingPattern;
        this.jointHolders = json.jointHolders;
        this.nominees = json.nominees;
        this.reportingEmail = json.reportingEmail;
        this.reportingFax = json.reportingFax;
        this.startDate = json.startDate;
        this.status = json.status;
        this.systemCode = json.systemCode;
    }
}