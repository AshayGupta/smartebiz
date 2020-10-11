import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../../../common/enums/enums';
import { HttpService } from '../../../../../httpService';
import { ApiUrl } from '../../../../../../common/constants/constants';
import { InvestmentIncomeReq, InvestmentIncomeResp, InvestmentIncomeSerializer } from '../../../../../../dataModels/getStInvestmentIncome.model';


const endPoint = ApiRouter.ApiRouter2 + 'esb/pension/getStInvestmentIncome';

@Injectable()
export class GetInvestmentIncomeService extends HttpService<InvestmentIncomeResp> {

    constructor(http: HttpClient) {
        super(
            http,
            ApiUrl.baseUrl,
            endPoint,
            new InvestmentIncomeSerializer()
        );
    }

    getIncome(data: InvestmentIncomeReq, cbResp: (res) => void, cbErr?: (err: boolean) => void) {
        super.create(data).subscribe((resp) => {
            console.log('getIncome response ->', resp);
            if ((resp.statusCode == StatusCode.Status200)) {
                cbResp(resp);
            }
        },
            error => {
                console.log('getIncome error -> ', error);
                if (error.status == StatusCode.Status403) {
                    cbErr(true);
                }
            });
    }

}

