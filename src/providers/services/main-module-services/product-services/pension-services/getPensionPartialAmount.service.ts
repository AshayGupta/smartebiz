import { GetPensionPartialAmountResp, GetPensionPartialAmountSerializer, GetPensionPartialAmountReq } from './../../../../../dataModels/getPensionPartialAmount.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../../common/enums/enums';
import { HttpService } from '../../../../httpService';
import { ApiUrl } from '../../../../../common/constants/constants';


const endPoint = ApiRouter.ApiRouter2 + 'esb/pension/getPartialAmount';

@Injectable()
export class GetPensionPartialAmountService extends HttpService<GetPensionPartialAmountResp> {

    constructor(http: HttpClient) {
        super(
            http,
            ApiUrl.baseUrl,
            endPoint,
            new GetPensionPartialAmountSerializer()
        );
    }

    getPartialAmount(data: GetPensionPartialAmountReq, cbResp: (res:GetPensionPartialAmountResp) => void, cbErr?: (err: HttpErrorResponse) => void) {
        super.create(data).subscribe((resp) => {
            console.log('getPartialAmount response ->', resp);
            if ((resp.statusCode == StatusCode.Status200)) {
                cbResp(resp);
            }
        },
            (error:HttpErrorResponse) => {
                console.log('getPartialAmount error -> ', error);
                if (error.status == StatusCode.Status403) {
                    cbErr(error);
                }
            });
    }

}

