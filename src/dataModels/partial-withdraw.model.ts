import { ApiResource } from "../common/interfaces/serializer";


export class GeneratePartialAmountReq {
    perNo: string;
    policyNo: string;
    source: string;
    siteAgentno: string;
    surrenderFee: string;
    transactionId: string;
    systemCode: string;
    countryCode: string;
    lobSrc: string;
}

export class GeneratePartialAmountResp extends ApiResource {
    effectiveDate: string;
    chargePerc: string;
    chargeVal: string;
    surrenderFee: string;
    maxSellValue: string;
    surrAdminChge: string;
    totalUnits: string;
    totalValue: string;
    totalSellUnits: string;
    totalSellValue: string;
    totalCharge: string;
    exciseDuty: string;
    netValue: string="0.00";

    constructor(json?: any) {
        super(json);
        if (json) {
            let _json = json.data;
            this.netValue = _json.netValue || "0.00";
            this.effectiveDate = _json.effectiveDate;
            this.chargePerc = _json.chargePerc;
            this.chargeVal = _json.chargeVal;
            this.surrenderFee = _json.surrenderFee;
            this.maxSellValue = _json.maxSellValue;
            this.totalUnits = _json.totalUnits;
            this.totalValue = _json.totalValue;
            this.totalSellUnits = _json.totalSellUnits;
            this.totalSellValue = _json.totalSellValue;
            this.totalCharge = _json.totalCharge;
            this.exciseDuty = _json.exciseDuty;
        }
    }

}

export class GeneratePartialAmountSerializer {

    toJson(obj: GeneratePartialAmountReq): any {
        console.log('GeneratePartialAmountSerializer toJson -> ', obj);
        return {
            siteAgentno: obj.siteAgentno,
            perno: obj.perNo,
            policyNo: obj.policyNo,
            surrenderFee: obj.surrenderFee,
            transactionId: obj.transactionId,
            systemCode: obj.systemCode,
            countryCode: obj.countryCode,
            lobSrc: obj.lobSrc
        };
    }

    fromJson(json: any): GeneratePartialAmountResp {
        console.log('GeneratePartialAmountSerializer fromJson -> ', json);
        let response = new GeneratePartialAmountResp(json);
        return response;
    }
}
