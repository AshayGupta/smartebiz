import { ApiResource } from "../common/interfaces/serializer";

export class DashboardReq {
    LobSrc: string;
    nationalID: string;
    passportNumber: string;
    pinNumber: string;
    productCategory: string;

}

export class DashboardResp extends ApiResource {

    accountCount: string = '0';
    LIFECount: string = '0';
    AMCCount: string = '0';
    GICount: string = '0';
    pension: string = '0';

    constructor(json?: any) {
        super(json);

        if (json) {

            let _json = json.data.AccountProxyServices.return;
            if (!_json) return;

            this.accountCount = _json.accountCount;
            this.LIFECount = _json.lifeCount;
            this.AMCCount = _json.AMCCount;
            this.GICount = _json.GICount;
            this.pension = _json.pension;
        }
    }
}

export class DashboardSerializer {

    toJson(obj: DashboardReq): any {
        console.log('DashboardSerializer toJson -> ', obj);
        return {
            LobSrc: obj.LobSrc,
            nationalID: obj.nationalID,
            passportNumber: obj.passportNumber,
            pinNumber: obj.pinNumber,
            productCategory: obj.productCategory
        };
    }

    fromJson(json: any): DashboardResp {
        console.log('DashboardSerializer fromJson -> ', json);
        let dashboardResp = new DashboardResp(json);
        return dashboardResp;
    }
}
