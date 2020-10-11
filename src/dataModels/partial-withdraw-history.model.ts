import { ApiResource } from "../common/interfaces/serializer";

export class PartialWithdrawHistoryReq {
    policyNo: string;
    collection: string;
}

export class PartialWithdrawHistory {
    policyNo: string;
    valueDate : string;
    percCharge : string;
    chrgVal : string;
    surrenderFee : string;
    maxSellVal : string;
    minVal : string;
    surrAdminChg: string;
    totalUnits: string;
    totalValue: string;
    totalSellUnits : string;
    totalSellValue : string;
    totalSellCharge : string;
    exciseDuty : string;
    netValue : string;
    status:string;
}

export class PartialWithdrawHistoryResp extends ApiResource {
    partialWithdrawHistoryList: PartialWithdrawHistory[] = [];

    constructor(json?: any) {
        super(json);
        if (json) {
            let _json = json.data;

            for (var i = 0; i < _json.length; i++) {
                let item = new PartialWithdrawHistory();

                item.policyNo = _json[i].response.policyNo;
                item.valueDate = _json[i].response.valueDate;
                item.percCharge = _json[i].response.percCharge;
                item.chrgVal = _json[i].response.chrgVal;
                item.surrenderFee = _json[i].response.surrenderFee;
                item.maxSellVal = _json[i].response.maxSellVal;
                item.minVal = _json[i].response.minVal;
                item.surrAdminChg = _json[i].response.surrAdminChg;
                item.totalUnits = _json[i].response.totalUnits;
                item.totalSellValue = _json[i].response.totalSellValue;
                item.totalSellCharge = _json[i].response.totalSellCharge;
                item.exciseDuty = _json[i].response.exciseDuty;
                item.netValue = _json[i].response.netValue;
                item.status = _json[i].response.status;

                this.partialWithdrawHistoryList.push(item);
            }

        }

    }

}

export class PartialWithdrawHistorySerializer {

    toJson(obj: PartialWithdrawHistoryReq): any {
        console.log('PartialWithdrawHistorySerializer toJson -> ', obj);
        return {
        };
    }

    fromJson(json: any): PartialWithdrawHistoryResp {
        console.log('PartialWithdrawHistorySerializer fromJson -> ', json);
        let response = new PartialWithdrawHistoryResp(json);
        return response;
    }
}