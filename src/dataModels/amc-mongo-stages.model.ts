import { PostedAmounts } from './make-payment.model';
import { UserDetails } from './user-details.model';
import { FundsList } from './product-action-items.model';
import { PersonalDetail, BankDetail } from './buy-product-model';
import { ApiResource } from '../common/interfaces/serializer';

export class AmcMongoStagesReq {
  id: string;
  mongoId: string;
  collection: string;

  amcTopUp: any = {};
  cp_amc_withdrawal: AmcWithdraw;
  cp_amc_switch: AmcSwitch;
  cp_pension_makecontribution: any;
  cp_pension_partial: any;
}

export class AmcSwitch {
  termAndCondition: TermAndCondition
  switchToFunds: SwitchToFunds[];
  stages: Stages[];
  otp: OtpVerification[];
  policyDetails: PolicyDetails;
  userDetails: UserDetails;
  switchFromFunds: SwitchFromFunds[];
  channel: string;
  source: string;
  TargetLob: string;
  transactionId: string;
  srRequest: SrRequest;
}
export class SwitchFromFunds {
  fundCode: string;
  fundName: string;
  amount: string;
}
export class SwitchToFunds {
  fundCode: string;
  fundName: string;
  amount: string;
}
export class AmcWithdraw {
  policyDetails: PolicyDetails;
  userDetails: UserDetails;
  partialRequestDetails: PartialRequestDetails;
  otp: OtpVerification[];
  termAndCondition: TermAndCondition;
  srRequest: SrRequest;
  transactionNumber: string;
  stages: Stages[];
  payoutDetails: PayoutDetails;
  channel: string;
  source: string;
  TargetLob: string;
  transactionId: string;
}
export class AmcTopUp {
  source: string;
  channel: string;
  userDetails: UserDetails;
  personalVerification: UserDetails;
  otpVerification: OtpVerification[];
  accountSelection: {};
  funds: PostedAmounts[];
  termAndCondition: TermAndCondition;
  payment: Payment[];
  stages: Stages[];
}
export class AmcOnboarding {
  source: string;
  channel: string;
  fund: FundsList[];
  userDetails: UserDetails;
  personalVerification: UserDetails;
  otpVerification: OtpVerification[];
  personalDetails: PersonalDetail;
  iprsCheck: any;
  isNewUser: boolean;
  addBankDetails: BankDetail;
  investmentAmount: string;
  termAndCondition: TermAndCondition;
  payment: Payment[];
  stages: Stages[] = [];
}
export class OtpVerification {
  mobileNumber: string;
  otp: string;
  dateTime: string;
  Timestamp: string;
  Otp: string;
}
export class SrRequest {
  srNumber: string;
  srDateTime: string;
  srStatus: string;
}
export class PartialRequestDetails {
  fundDetails: FundDetails[];
  maximumAmount: string;
  withDrawalAmount: string;
  transactionId: string;
}
export class FundDetails {
  amount: string;
  fundCode: string;
  fundName: string;
}
export class PayoutDetails {
  mobileNumber: string;
  payoutMethod: string;
  bankId: string;
  branchName: string;
  bankName: string;
  bankAccountNo: string;
  accountHolderName: string;
  payoutMethodstring: string;
}
export class PolicyDetails {
  lobSrc: string;
  accountNumber: string;
}
export class TermAndCondition {
  termAndCondition: string;
  checked: boolean = false;
}
export class Payment {
  paymentMethod: string;
  amount: string;
  transationNumber: string;
  resultCode: string;
  summary: string;
  status: string;
  date: string;
}
export class Stages {
  name: string;
  status: string;
}

export class AmcMongoStagesResp extends ApiResource {
  id: string;

  constructor(json: any) {
    super(json);

    if (!json.data || json.data.length == 0) return;

    this.id = json.data[0]._id;
  }
}

export class AmcMongoStagesSerializer {

  toJson(obj: AmcMongoStagesReq): any {
    console.log('AmcMongoStagesSerializer toJson -> ', obj);
    return obj;
  }

  fromJson(json: any): any {
    console.log('AmcMongoStagesSerializer fromJson -> ', json);
    let response = new AmcMongoStagesResp(json);
    return response;
  }
}
