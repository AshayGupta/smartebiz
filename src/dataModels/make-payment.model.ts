import { TransactionChargesResp } from './transaction-charges.model';
import { ApiResource } from "../common/interfaces/serializer";
import { Utils } from './../common/utils/utils';
import { UserDetails } from './user-details.model';
import { LoanOutstanding } from "./premium-due.model";

export class PaymentList {
    referenceNo: string;
    accountName: string;
    accountNumber: string;
    premiumAmount: string;
    suspenseAmount: string;
    excessAmount: string;
    productTotalAmount: string = '0.0';
    totalAmount: string;
    lob: string;
    loanOutstanding: LoanOutstanding[] = [];
    preminumCheckboxStatus: boolean = true;
    excessCheckboxStatus: boolean = false;
}

export class PostedAmounts {
    accountNumber: string;
    amount: string;

    // NEW Make Payment;
    fundCode: string;
    fundName: string;
    transactionType: string;
    paymentMode: string;
    paymentBankCode: string;
    clientCode: string;
    currentHoldingValue:string;
    deduction:TransactionChargesResp;
    totalDeduction:string;

}

export class MakePaymentReq {
    msisdn: string;
    firstName: string;
    middleName: string;
    lastName: string;
    accountNumber: string = '';
    amount: string;
    phoneNumber: string;
    paybillNumber: string;
    lobSrc: string;
    productName: string;
    postedAmount: PostedAmounts[] = [];
    userDetails: UserDetails = new UserDetails();
    transactionNumber: string;
    email: string;
    channel: string;
    customerId: string;
    action:string;
    transactionType: string;
    totalAmount:string;
    Summary:string;
    docType:string;
    policyNo:string;
}

export class MakePaymentResp extends ApiResource {
    resultCode: string;
    resultDesc: string;
    checkoutRequestID: string;
    merchantRequestID: string;
    responseCode: string;
    responseDescription: string;
    srNumber:string;

    constructor(json?: any) {
        super(json);

        if (json) {
            let _json = json.data.stkPushQuery;
            if (_json) {
                let data = _json.data;
                this.checkoutRequestID = data.CheckoutRequestID;
                this.merchantRequestID = data.MerchantRequestID;
                this.responseCode = data.ResponseCode;
                this.responseDescription = data.ResponseDescription;
                this.resultCode = data.ResultCode;
                this.resultDesc = data.ResultDesc;
            }
            this.srNumber=json.data.SRNumber;
        }

    }
}

export class MakePaymentSerializer {

    toJson(obj: MakePaymentReq): any {
        console.log('MakePaymentSerializer toJson -> ', obj);
        return {
            msisdn: obj.phoneNumber,
            firstname: obj.firstName,
            middlename: obj.middleName,
            lastname: obj.lastName,
            accountNumber: obj.accountNumber,
            policyNo: obj.policyNo,
            Amount: Utils.ceilValue(obj.amount),
            totalAmount:obj.totalAmount,
            PhoneNumber: obj.phoneNumber,
            paybillNumber: obj.paybillNumber,
            LobSrc: obj.lobSrc,
            lobSrc: obj.lobSrc,
            postedAmounts: { 'postedAmount': obj.postedAmount },
            userDetails: {
                idType: obj.userDetails.idType,
                idValue: obj.userDetails.idValue
            },
            transactionNumber: obj.transactionNumber,
            emailAddress: obj.email,
            customerId: obj.customerId,
            channel: obj.channel,
            transactionType: obj.transactionType,
            action:obj.action,
            Summary:obj.Summary,
            docType:obj.docType
        };
    }

    fromJson(json: any): MakePaymentResp {
        console.log('MakePaymentSerializer fromJson -> ', json);
        let response = new MakePaymentResp(json);
        return response;
    }
}
