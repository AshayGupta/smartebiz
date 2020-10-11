import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';
import { HttpService } from '../../../httpService';
import { ApiUrl } from '../../../../common/constants/constants';
import { LoanHistoryResp, LoanHistorySerializer, LoanHistoryReq } from '../../../../dataModels/loan-history.model';

const endPoint = ApiRouter.ApiRouter2 + '/mgo/cp/manageCpCollections?collection=cp_loan&qry=';


@Injectable()
export class LoanHistoryListService extends HttpService<LoanHistoryResp>  {

    constructor(http: HttpClient) {
        super(
            http,
            ApiUrl.baseUrl,
            endPoint,
            new LoanHistorySerializer()
        );
    }

    getLoanHistoryList(data: LoanHistoryReq, cbResp: (res: LoanHistoryResp) => void, cbErr?: (err: boolean) => void) {
        const reqData = {
            "request.personNumber": data.personNumber,
            "request.collection": data.collection,
        }

        super.queryString(JSON.stringify(reqData)).subscribe((resp: LoanHistoryResp) => {
            console.log('getLoanHistoryList response -> ', resp);
            if ((resp.statusCode == StatusCode.Status200)) {
                cbResp(resp)
            }
        },
            error => {
                console.log('getLoanHistoryList error -> ', error);
                if (error.status == StatusCode.Status403) {
                    cbErr(true);
                }
            });
    }

}
