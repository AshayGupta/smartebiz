import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../../../httpService';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';
import { ApiUrl } from '../../../../common/constants/constants';
import { LoanBalancesResp, LoanBalancesSerializer, LoanBalancesReq } from '../../../../dataModels/loan-balance.model';


const endPoint = ApiRouter.ApiRouter2 + 'esb/loan/getLoanBalances';

@Injectable()
export class LoanBalancesService extends HttpService<LoanBalancesResp>  {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new LoanBalancesSerializer()
    );
  }

  getLoanBalance(data: LoanBalancesReq, cbResp: (res: LoanBalancesResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: LoanBalancesResp) => {
      console.log('getLoanBalances response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getLoanBalances error -> ', error);
        if (error.status == StatusCode.Status403) {
          cbErr(true);
        }
      });
  }

}
