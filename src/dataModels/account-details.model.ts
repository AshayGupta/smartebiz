export class AccountDetails {
  caption: Caption;
  elementName: string;
  showInFull: boolean;
  showInInitial: boolean;
  value: string;



  //New AccountHolding Response
  schemeName: string;
  quantity: string;
  originalCost: string;
  marketValue: string;
  gainLoss: string;
  unrealizedGainLossPerc: string;
  holdingDate: string;
  accountCode: string;
  accountNumber: string;
  planID: string;
  productCode: string;
  disableFund: boolean;

  // canSwitchAndWithdraw:string;
  // reason:string;


  constructor(json: any) {
    this.caption = json.caption ? new Caption(json.caption) : undefined;
    this.elementName = json.elementName;
    this.showInFull = json.showInFull;
    this.showInInitial = json.showInInitial;
    this.value = json.value;

    //New Account Holding Response
    this.schemeName = json.schemeName;
    this.quantity = json.quantity;
    this.originalCost = json.originalCost;
    this.marketValue = json.marketValue;
    this.gainLoss = json.gainLoss;
    this.unrealizedGainLossPerc = json.unrealizedGainLossPerc;
    this.holdingDate = json.holdingDate;
    this.accountCode = json.accountCode;
    this.accountNumber = json.accountNumber;
    this.planID = json.planID;
    this.productCode = json.productCode;

    
  }
}

export class Caption {
  en: string;

  constructor(json: any) {
    this.en = json.en;
  }

}

export class AccountDetailReq {
  accountNumber: string;
  formatted: boolean;
  lobSrc: string;
}
