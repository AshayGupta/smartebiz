import { ApiResource } from "../common/interfaces/serializer";
import { DeductionList } from "./generate-loan-quote.model";
import { UserDetails } from './user-details.model';


export class AdvanceQuoteReq {
    availableAmount: string = '0.00';
    loanAmount: string;
    loanLimit: string;
    policyNo: string;
    policyName: string;
    perNo: string;
    source: string;
    repaymentMode: string;
    loanPeriod: string;
    paymentMode: string;
    premiumBankAcc: string;
    bankAccNo: string;
    loanPayee: string;
    lobSrc: string;
    rateOfInterest: string;
    bankName: string;
    bankBranch: string;
    monthlyInstallment: string;
    interestPaid: string;
    totalAmount: string;
    loanType: string;
    accountName: string;
    mobile: string;
    bankNumber: string;
    accountNumberId:string;
    deductionList: DeductionList = new DeductionList();
    userDetails: UserDetails = new UserDetails();
}

export class AdvanceQuoteResp extends ApiResource {

    constructor(json: any) {
        super(json);

        // let _json = json.data;

    }
}

export class AdvanceQuoteSerializer {

    toJson(obj: AdvanceQuoteReq): any {
        console.log('AdvanceQuoteSerializer toJson -> ', obj);
        return {
            policyNo: obj.policyNo,
            perno: obj.perNo, 
            lobSrc: obj.lobSrc, 
            source: obj.source,
            amount: obj.loanAmount,
            repaymentMode: 'C',
            loanPeriod: obj.loanPeriod,
            paymentMode: obj.paymentMode,
            premiumBankAcc: 'MA', 
            bankAccNo: obj.accountNumberId,
            loanPayee: obj.accountName, 
            accountNumberId:obj.accountNumberId,
            // deductionList:obj.deductionList.deductionArray,    
            userDetails: {
                idType: obj.userDetails.idType,
                idValue: obj.userDetails.idValue
            }
        };

    }

    fromJson(json: any): AdvanceQuoteResp {
        console.log('AdvanceQuoteSerializer fromJson -> ', json);
        let response = new AdvanceQuoteResp(json);
        return response;
    }
}