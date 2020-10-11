import { ApiResource } from "../common/interfaces/serializer";
import { AccountDetails, Caption } from "./account-details.model";


export class AmcAccountHoldingsReq {
  accountNumber: string;
  formatted: boolean = true;
}

export class AmcAccountHoldingsResp extends ApiResource {
  accountHoldings = [];
  amcFunds: AccountDetails[] = [];

  canSwitchAndWithdraw:string;
  reason:string;


  constructor(json: any) {
    super(json);

    let _json = json.data;

    this.canSwitchAndWithdraw=_json.canSwitchAndWithdraw;
    this.reason=_json.reason;


    let accountDetails: AccountDetails[][] = [];
    let captions: Caption[] = [];

    for (var i = 0; i < _json.length; i++) {
      let detailsList: AccountDetails[] = [];
      for (var j = 0; j < _json[i].length; j++) {
        let details = new AccountDetails(_json[i][j]);
        detailsList.push(details);
        if (i == 0) {
          captions.push(details.caption);
        }
      }
      accountDetails.push(detailsList);
    }

    this.accountHoldings.push(accountDetails);
    this.accountHoldings.push(captions);

    //New AccountHolding Response
    if (_json.accountHolding) {
      let funds = _json.accountHolding;

      for (i = 0; i < funds.length; i++) {
        let fund = new AccountDetails(funds[i]);
        this.amcFunds.push(fund);
      }
    }
    //New AccountHolding Response

  }
}

export class AmcAccountHoldingsSerializer {

  toJson(obj: AmcAccountHoldingsReq): any {
    console.log('AmcAccountHoldingsSerializer toJson -> ', obj);
    return {
      accountNumber: obj.accountNumber,
      formatted: obj.formatted
    };
  }

  fromJson(json: any): AmcAccountHoldingsResp {
    console.log('AmcAccountHoldingsSerializer fromJson -> ', json);
    let response = new AmcAccountHoldingsResp(json);
    return response;
  }
}
