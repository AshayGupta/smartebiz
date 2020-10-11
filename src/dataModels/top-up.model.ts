import { TermAndCondition } from './amc-mongo-stages.model';
import { TransactionChargesResp } from './transaction-charges.model';
import { FundsList } from './product-action-items.model';
import { AccountDetails } from './account-details.model';
import { UserDetails } from './user-details.model';
import { PostedAmounts } from "./make-payment.model";

export class TopUpReq {
  lobSrc:string;
  firstname: string;
  middlename:string;
  lastname: string;
  accountNumber: string;
  clientCode:string;
  amount: string;
  currentHoldingValue:string;
  minInvestmentAmt:string;
  PhoneNumber: string;
  email:string;
  transactionNumber:string;
  paybillNumber: string;
  postedAmount: PostedAmounts[];
  userDetails: UserDetails;
  paymentMode:string;
  paymentMethodSelected: string;
  bankAccNo:string;
  bankBranch:string;
  accountName:string;
  bankName:string;
  bankNumber:string;
  accountNumberId :string;
  maximumAmount:string;
  transactionCharges:TransactionCharge;
  totalCharges:string;
  tnc: TermAndCondition;
  dateOfBirth:string;
  gender:string
  nationality:string;
  occupation:string;
  personStatus:string;
  pinNumber:string;
  salutation:string;

  mpesaBankNumber:string;
}

export class TransactionCharge{
  withdrawalCharge:string;
  initialFees:string;
  fundTransfer:string;
  totalCharges:string;
}
