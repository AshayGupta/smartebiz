import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../../../common/enums/enums';
import { HttpService } from '../../../../../httpService';
import { ApiUrl } from '../../../../../../common/constants/constants';
import { OpeningBalanceResp, OpeningBalanceSerializer, OpeningBalanceReq } from '../../../../../../dataModels/getStOpeningBalance.model';

const endPoint = ApiRouter.ApiRouter2 + 'esb/pension/getStOpeningBalance';

@Injectable()
export class GetStOpenBalanceService extends HttpService<OpeningBalanceResp> {

    constructor(http: HttpClient) {
        super(
            http,
            ApiUrl.baseUrl,
            endPoint,
            new OpeningBalanceSerializer()
        );
    }

    getOpenBalance(data: OpeningBalanceReq, cbResp: (res) => void, cbErr?: (err: boolean) => void) {
        super.create(data).subscribe((resp) => {
            console.log('getOpenBalance response ->', resp);
            if ((resp.statusCode == StatusCode.Status200)) {
                cbResp(resp);
            }
        },
            error => {
                console.log('getOpenBalance error -> ', error);
                if (error.status == StatusCode.Status403) {
                    cbErr(true);
                }
            });
    }

}

