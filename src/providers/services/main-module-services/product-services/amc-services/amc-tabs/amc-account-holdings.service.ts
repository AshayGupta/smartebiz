import { AmcAccountHoldingsReq, AmcAccountHoldingsResp, AmcAccountHoldingsSerializer } from './../../../../../../dataModels/amc-account-holdings.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../../../common/enums/enums';
import { ApiUrl } from '../../../../../../common/constants/constants';
import { HttpService } from '../../../../../httpService';

const endPoint = ApiRouter.ApiRouter2 + 'esb/amc/getAccountHoldings';

@Injectable()
export class AmcAccountHoldingsService extends HttpService<AmcAccountHoldingsResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new AmcAccountHoldingsSerializer()
    );
  }

  getHoldings(data: AmcAccountHoldingsReq, cbResp: (res: AmcAccountHoldingsResp) => void, cbErr?: (err: HttpErrorResponse) => void) {
    super.create(data).subscribe((resp: AmcAccountHoldingsResp) => {
      console.log('getHoldings response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200) && resp.accountHoldings.length > 0) {
        cbResp(resp)
      }
    },
    (error: HttpErrorResponse) => {
      console.log('doLogin error ->', error);
      cbErr(error);
    });
  }

}
