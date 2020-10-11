import { TransactionCharge } from './top-up.model';
import { TermAndCondition } from './amc-mongo-stages.model';
import { FundsList } from './product-action-items.model';
import { UserDetails } from './user-details.model';

export class Switch {
  lobSrc: string;
  firstname: string;
  middlename:string;
  lastname: string;
  accountNumber: string;
  clientCode:string;
  amount: string;
  currentHoldingValue:string;
  phoneNumber: string;
  email:string;
  transactionNumber:string;
  userDetails: UserDetails;
  dateOfBirth:string;
  gender:string
  nationality:string;
  occupation:string;
  personStatus:string;
  pinNumber:string;
  salutation:string;
  transactionType: string;
  tranType: string;
  switchOrder:SwitchList[];
  totalCharges:string;
  tnc: TermAndCondition;

}

export class SwitchList {
 transferFrom:TransferFrom;
 transferTo:TransferTo[];
}

export class TransferFrom{
fundCode:string;
amount:string;
fundName:string;
}

export class TransferTo {
  fundList:FundsList[];
  amount:string;
  targetFundCode:string;
  targetFundName:string;
  deduction:TransactionCharge;
}
