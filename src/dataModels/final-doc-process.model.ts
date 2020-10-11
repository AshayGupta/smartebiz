export class FinalDocProcessReq {
  emailAddress: string;
  customerName: string;
  srNumber: string;
  policyNo: string;
  transactionType: string;
  transactionNumber:string;
  accountNumber:string;
  totalAmount:string;
  resultCode:string;
}

export class FinalDocProcessSerializer {

    toJson(obj: FinalDocProcessReq): any {
        console.log('FinalDocProcessSerializer toJson -> ', obj);
        return {
            emailAddress: obj.emailAddress,
            customerName: obj.customerName,
            srNumber: obj.srNumber,
            policyNo: obj.policyNo,
            transactionType: obj.transactionType,
            transactionNumber:obj.transactionNumber,
            accountNumber:obj.accountNumber,
            totalAmount:obj.totalAmount,
            resultCode:obj.resultCode
        };
    }

    fromJson(json: any): any {
        console.log('FinalDocProcessSerializer fromJson -> ', json);
        return json;
    }
}
