import { ActionItemsResp } from "./product-action-items.model";


export class AccountList {
    accountNumber: string;
    agentType: string;
    clientId: string;
    firstName: string;
    idDocumentNumber: string;
    lobSrc: string;
    payroleRef: string;
    policyRefNumber: string;
    productCategory: string;
    productID: string;
    productName: string;
    startDate: string;
    status: string;
    sumAssured: string;
    surname: string;
    productCode: string;
    dueDate: string;
  
    canSwitchAndWithdraw:string;
    reason:string;


    actionItemsResp: ActionItemsResp = new ActionItemsResp();

    constructor(json?: any) {
        if (json) {
            this.accountNumber = json.accountNumber;
            this.agentType = json.agentType;
            this.clientId = json.clientId;
            this.firstName = json.firstname;
            this.idDocumentNumber = json.idDocumentNumber;
            this.lobSrc = json.lobSrc;
            this.payroleRef = json.payroleRef;
            this.policyRefNumber = json.policyRefNumber;
            this.productCategory = json.productCategory;
            this.productID = json.productID;
            this.productCode = json.productCode;
            this.productName = json.productName;
            this.startDate = json.startDate;
            this.status = json.status;
            this.sumAssured = json.sumAssured;
            this.surname = json.surname;
        }

    }
}