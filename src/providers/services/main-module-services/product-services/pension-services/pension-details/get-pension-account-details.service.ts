import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../../../common/enums/enums';
import { HttpService } from '../../../../../httpService';
import { ApiUrl } from '../../../../../../common/constants/constants';
import { PensionAccountDetailsResp, PensionAccountDetailsReq, PensionAccountDetailsSerializer } from '../../../../../../dataModels/pension-account-details.model';


const endPoint = ApiRouter.ApiRouter2 + 'esb/pension/getAccountDetails';

@Injectable()
export class GetPensionAccountDetailsService extends HttpService<PensionAccountDetailsResp> {

    constructor(http: HttpClient) {
        super(
            http,
            ApiUrl.baseUrl,
            endPoint,
            new PensionAccountDetailsSerializer()
        );
    }

    getAccountDetails(data: PensionAccountDetailsReq, cbResp: (res) => void, cbErr?: (err: boolean) => void) {
        super.create(data).subscribe((resp) => {
            console.log('getAccountDetails response ->', resp);
            if ((resp.statusCode == StatusCode.Status200)) {
                cbResp(resp);
            }
        },
            error => {
                console.log('getAccountDetails error -> ', error);
                if (error.status == StatusCode.Status403) {
                    cbErr(true);
                }
            });
    }

}

