import { ApiResource } from "../common/interfaces/serializer";

export class PendingOrdersReq{
    lobSrc: string;
    accountNumber: string;
    fundCode: string;
}


export class PendingOrdersResp extends ApiResource{
    orderType: string;
    orderAmount: string;
    orderStatus: string;

    constructor(json?: any) {
        super(json);
        if (json) {
            let _json = json.data[0];
            this.orderType= _json.orderType;
            this.orderAmount=_json.orderAmount;
            this.orderStatus=_json.orderStatus;

            }
        }
    }
    export class PendingOrdersSerializer {
        toJson(obj: PendingOrdersReq): any {
            console.log('PendingOrdersSerializer toJson -> ', obj);
            return {
                lobSrc:obj.lobSrc,
                accountNumber:obj.accountNumber,
                fundCode:obj.fundCode

            };
        }
        fromJson(json: any): PendingOrdersResp {
            console.log('PendingOrdersSerializer fromJson -> ', json);
            let response = new PendingOrdersResp(json);
            return response;
        }
    }
