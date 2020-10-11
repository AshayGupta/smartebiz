import { ApiResource } from "../common/interfaces/serializer";
import { Utils } from "../common/utils/utils";

export class GetPensionPartialAmountReq {
  siteAgentno: string;
  perno: string;
  policyNo: string;
  surrenderFee: string;
  lobSrc: string;
  transactionId: string;
  systemCode: string;
  countryCode: string;
  memberId: string;
  statementYear: string;
}

export class GetPensionPartialAmountResp extends ApiResource {
  registeredDetail: EmployeeDetail;
  unRegisteredDetail: EmployeeDetail;

  constructor(json?: any) {
    super(json);
    if (json) {

      let _json = json.data.getWithdrawalBalancesPensionResponse.return[0];
      this.registeredDetail = null;
      this.unRegisteredDetail = null;

      //Registered
      if (_json.withdrawalBalances_details && _json.withdrawalBalances_details.withdrawalBalancesRegisterd_details) {

        let registered_detail = _json.withdrawalBalances_details.withdrawalBalancesRegisterd_details.registered_detail;
        if (registered_detail && registered_detail.length > 0) {
          this.registeredDetail = new EmployeeDetail(registered_detail[0]);
        }
      }

      // Un-Registered
      if (_json.withdrawalBalances_details && _json.withdrawalBalances_details.withdrawalBalancesUnregisterd_details) {

        let unregistered_detail = _json.withdrawalBalances_details.withdrawalBalancesUnregisterd_details.unregistered_detail;
        if (unregistered_detail && unregistered_detail.length > 0) {
          this.unRegisteredDetail = new EmployeeDetail(unregistered_detail[0]);

        }
      }
    }
  }
}

export class EmployeeDetail {
  ee_fund_interest: string;
  er_fund_interest: string;
  ee_closing_bal_value: string;
  er_closing_bal_value: string;
  fund_interest: string;
  tax_on_interest: string;
  status: string;
  locked_in_amount: string;
  asat_ord: string;
  tt: string;

  constructor(json?: any) {
    this.ee_fund_interest = Utils.isEmpty(json.ee_fund_interest) ? '0': json.ee_fund_interest;
    this.er_fund_interest = Utils.isEmpty(json.er_fund_interest) ? '0': json.er_fund_interest;
    this.ee_closing_bal_value = Utils.isEmpty(json.ee_closing_bal_value) ? '0.00': json.ee_closing_bal_value;
    this.er_closing_bal_value = Utils.isEmpty(json.er_closing_bal_value) ? '0.00': json.er_closing_bal_value;
    this.fund_interest = Utils.isEmpty(json.fund_interest) ? '0.00': json.fund_interest;
    this.tax_on_interest = Utils.isEmpty(json.tax_on_interest) ? '0.00': json.tax_on_interest;
    this.status = json.status;
    this.locked_in_amount = Utils.isEmpty(json.locked_in_amount) ? '0.00': json.locked_in_amount;
    this.asat_ord = json.asat_ord;
    this.tt = json.tt;
  }
}

export class GetPensionPartialAmountSerializer {

  toJson(obj: GetPensionPartialAmountReq): any {
    console.log('GetPensionPartialAmountSerializer toJson -> ', obj);
    return obj;
  }

  fromJson(json: any): GetPensionPartialAmountResp {
    console.log('GetPensionPartialAmountSerializer fromJson -> ', json);
    let response = new GetPensionPartialAmountResp(json);
    return response;
  }
}
