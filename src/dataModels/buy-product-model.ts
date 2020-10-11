import { ApiResource } from "../common/interfaces/serializer";
import { FundsList } from "./product-action-items.model";
import { UserDetails } from "./user-details.model";
import { OtpVerification, TermAndCondition } from "./amc-mongo-stages.model";
import { FileAttachmentReq } from "./file-attachment.model";

export class PersonalDetail {
    firstName: string;
    middleName: string;
    lastName: string;
    dob: string;
    nationality: string;
    countryCode: string;
    email:string;
    gender:string;
    mobile:string;
    physicalAddress:string;
    kraPin:string;
    iprsVerified: string;
    fullName() {
        return this.firstName +' '+ (!this.middleName?'':this.middleName) +' '+ this.lastName;
    }
}

export class BankDetail {
    bankName: string;
    branchName: string;
    bankCode:string;
    accountNumber: string;
    verifyAccountNumber: string;
    accountName: string;
    documentType:string;
    documentNumber:string;
    transactionNumber: string;
    documents:Array<any> = [];
}

export class Investment {
    selectedFund: FundsList;
    moreFunds: FundsList[];
    totalAmount: string = '0.00';
}

export class BuyProductReq {
    userDetails: UserDetails;
    personalDetail:PersonalDetail;
    bankDetail:BankDetail;
    investment:Investment;

    lobSrc: string;
    isNewUser: boolean;
    tnc: TermAndCondition;
    paymentMethodSelected: string;
    bankFileAttach: FileAttachmentReq = new FileAttachmentReq();
    otpVerification: OtpVerification[] = [];
}
