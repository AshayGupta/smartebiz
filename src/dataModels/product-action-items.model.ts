import { PendingOrdersResp } from './pending-orders.model';
import { ApiResource } from "../common/interfaces/serializer";
import { Utils } from "../common/utils/utils";


export class ActionItemsReq {
  productCode: string;
  lobSrc: string;
}

export class FundsList {
  loanAllowed: boolean = false;
  partialWithdrawalAllowed: boolean = false;
  makePaymentAllowed: boolean = false;
  raiseRequestAllowed: boolean = true;
  switch: boolean = false;
  invest: boolean = false;
  updateBeneficiary: boolean = false;
  viewPolicyStatement: boolean = false;
  productCode: string;
  productName: string;
  lockingPeriod: string;
  minInvestmentAmnt: string;
  minWithdrawalAmnt: string;
  doubleWithdrawalCharge: string;
  initialFeePercentage: string;
  investedAmount: string;
  accountCode:string;

  currentHoldingValue:string;
  pendingAmount:string;
  productOrdering:string;
  disableFund: boolean = false;
}

export class ActionItemsResp extends ApiResource {
  fundsList: FundsList[];

  constructor(json?: any) {
    super(json);

    if (json && json.data) {
      let _jsonFund = json.data;

      this.fundsList = [];
      _jsonFund.filter(item => {
        let list = new FundsList();

        list.loanAllowed = Utils.removeNull(item.loanAllowed) == "Y" ? true : false;
        list.partialWithdrawalAllowed = Utils.removeNull(item.partialWithdrawalAllowed) == "Y" ? true : false;
        list.makePaymentAllowed = Utils.removeNull(item.MakePremiumPayment) == "Y" || Utils.removeNull(item.MakeLoanRpayment) == "Y" ? true : false;
        list.switch = Utils.removeNull(item.switch) == "Y" ? true : false;
        list.invest = Utils.removeNull(item.invest) == "Y" ? true : false;
        list.updateBeneficiary = Utils.removeNull(item.ChangeBeneficiaries) == "Y" ? true : false;
        list.viewPolicyStatement = Utils.removeNull(item.ViewPolicyStatement) == "Y" ? true : false;
        list.lockingPeriod = item.lockingPeriod;
        list.minInvestmentAmnt = item.minInvestmentAmnt;
        list.minWithdrawalAmnt = item.minWithdrawalAmnt;
        list.productOrdering=item.productOrdering;
        list.productCode = item.productCode;
        list.productName = item.productName;

        this.fundsList.push(list);
      });
    }

  }
}

export class ProductActionItemsSerializer {

  toJson(obj: ActionItemsReq): any {
    console.log('ProductActionItemsSerializer toJson -> ', obj);
    return {
      productCode: obj.productCode,
      lobSrc: obj.lobSrc
    };
  }

  fromJson(json: any): ActionItemsResp {
    console.log('ProductActionItemsSerializer fromJson -> ', json);
    let response = new ActionItemsResp(json);
    return response;
  }
}
