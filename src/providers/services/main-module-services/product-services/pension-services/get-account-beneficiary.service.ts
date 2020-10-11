import { BeneficiaryAccountResp, BeneficiaryAccountReq, BeneficiaryAccountSerializer } from './../../../../../dataModels/get-beneficiary-account.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../../common/enums/enums';
import { HttpService } from '../../../../httpService';
import { ApiUrl } from '../../../../../common/constants/constants';


const endPoint = ApiRouter.ApiRouter2 + 'esb/pension/getAccountBeneficiaries';

@Injectable()
export class GetAccountBeneficiariesService extends HttpService<BeneficiaryAccountResp> {

    constructor(http: HttpClient) {
        super(
            http,
            ApiUrl.baseUrl,
            endPoint,
            new BeneficiaryAccountSerializer()
        );
    }

    getBeneficiariesAccount(data: BeneficiaryAccountReq, cbResp: (res) => void, cbErr?: (err: boolean) => void) {
        super.create(data).subscribe((resp) => {
            console.log('getBeneficiariesAccount response ->', resp);
            if ((resp.statusCode == StatusCode.Status200)) {
                cbResp(resp);
            }
        },
            error => {
                console.log('getBeneficiariesAccount error -> ', error);
                if (error.status == StatusCode.Status403) {
                    cbErr(true);
                }
            });
    }

}

