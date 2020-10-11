import { ApiRouter, StatusCode } from "../../../../common/enums/enums";
import { Injectable } from "@angular/core";
import { HttpService } from "../../../httpService";
import { PendingOrdersResp, PendingOrdersSerializer, PendingOrdersReq } from "../../../../dataModels/pending-orders.model";
import { HttpClient} from "@angular/common/http";
import { ApiUrl } from "../../../../common/constants/constants";

const endPoint = ApiRouter.ApiRouter2 + 'esb/amcBuyOnline/getPendingOrders';

@Injectable()
export class PendingOrdersService extends HttpService<PendingOrdersResp> {

    constructor(http: HttpClient) {
        super(
            http,
            ApiUrl.baseUrl,
            endPoint,
            new PendingOrdersSerializer()
        );
    }

    getPendingOrder(data: PendingOrdersReq, cbResp: (res: PendingOrdersResp) => void, cbErr?: (err: boolean) => void) {
        super.create(data).subscribe((resp) => {
          console.log('pendingOrderService response ->', resp);
          if (resp.statusCode == StatusCode.Status200) {
            cbResp(resp);
          }
        },
            error => {
                console.log('pendingOrderService error -> ', error);
                // if (error.status == StatusCode.Status403) {
                //     cbErr(true);
                // }
            });
    }

}
