import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../../../common/enums/enums';
import { HttpService } from '../../../../../httpService';
import { ApiUrl } from '../../../../../../common/constants/constants';
import { BenefitPaymentsResp, BenefitPaymentsSerializer, BenefitPaymentsReq } from '../../../../../../dataModels/getStBenefitPayments.model';

const endPoint = ApiRouter.ApiRouter2 + 'esb/pension/getStBenefitPayments';

@Injectable()
export class GetStBenefitPaymentsService extends HttpService<BenefitPaymentsResp> {

    constructor(http: HttpClient) {
        super(
            http,
            ApiUrl.baseUrl,
            endPoint,
            new BenefitPaymentsSerializer()
        );
    }

    getBenefit(data: BenefitPaymentsReq, cbResp: (res) => void, cbErr?: (err: boolean) => void) {
        super.create(data).subscribe((resp) => {
            console.log('getBenefit response ->', resp);
            if ((resp.statusCode == StatusCode.Status200)) {
                cbResp(resp);
            }
        },
            error => {
                console.log('getBenefit error -> ', error);
                if (error.status == StatusCode.Status403) {
                    cbErr(true);
                }
            });
    }

}

