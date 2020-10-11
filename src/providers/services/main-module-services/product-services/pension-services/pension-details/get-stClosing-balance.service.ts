import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../../../common/enums/enums';
import { HttpService } from '../../../../../httpService';
import { ApiUrl } from '../../../../../../common/constants/constants';
import { ClosingBalanceResp, ClosingBalanceSerializer, ClosingBalanceReq } from '../../../../../../dataModels/getStClosingBalance.model';

const endPoint = ApiRouter.ApiRouter2 + 'esb/pension/getStClosingBalance';

@Injectable()
export class GetStClosingBalanceService extends HttpService<ClosingBalanceResp> {

    constructor(http: HttpClient) {
        super(
            http,
            ApiUrl.baseUrl,
            endPoint,
            new ClosingBalanceSerializer()
        );
    }

    getClosingBalance(data: ClosingBalanceReq, cbResp: (res) => void, cbErr?: (err: boolean) => void) {
        super.create(data).subscribe((resp) => {
            console.log('getClosingBalance response ->', resp);
            if ((resp.statusCode == StatusCode.Status200)) {
                cbResp(resp);
            }
        },
            error => {
                console.log('getClosingBalance error -> ', error);
                if (error.status == StatusCode.Status403) {
                    cbErr(true);
                }
            });
    }

}

