import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';
import { HttpService } from '../../../httpService';
import { ApiUrl } from '../../../../common/constants/constants';
import { PartialWithdrawHistoryResp, PartialWithdrawHistorySerializer, PartialWithdrawHistoryReq } from '../../../../dataModels/partial-withdraw-history.model';
 
const endPoint = ApiRouter.ApiRouter2 + '/mgo/cp/manageCpCollections?collection=cp_pw&qry='; 


@Injectable()
export class PartialWithdrawHistoryListService extends HttpService<PartialWithdrawHistoryResp>  {

    constructor(http: HttpClient) {
        super(
            http,
            ApiUrl.baseUrl,
            endPoint,
            new PartialWithdrawHistorySerializer()
        );
    }

    getPartialWithdrawHistoryList(data: PartialWithdrawHistoryReq, cbResp: (res: PartialWithdrawHistoryResp) => void, cbErr?: (err: boolean) => void) {

        const reqData = {
            "request.policyNo": data.policyNo, 
            "request.collection": data.collection,
        }

        super.queryString(JSON.stringify(reqData)).subscribe((resp: PartialWithdrawHistoryResp) => {
            console.log('getPartialWithdrawHistoryList response -> ', resp);
            if ((resp.statusCode == StatusCode.Status200)) {
                cbResp(resp)
            }
        },
            error => {
                console.log('getPartialWithdrawHistoryList error -> ', error);
                if (error.status == StatusCode.Status403) {
                    cbErr(true);
                }
            });
    }

}
