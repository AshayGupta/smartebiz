import { AmcFundTransactionResp, AmcFundTransactionReq, AmcFundTransactionSerializer } from './../../../../../../dataModels/amc-fund-transaction.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../../../common/enums/enums';
import { ApiUrl } from '../../../../../../common/constants/constants';
import { HttpService } from '../../../../../httpService';

const endPoint = ApiRouter.ApiRouter2 + 'esb/amc/getAccountFundTransactions';

@Injectable()
export class AmcFundTransactionService extends HttpService<AmcFundTransactionResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new AmcFundTransactionSerializer()
    );
  }

  getAcTransaction(data: AmcFundTransactionReq, cbResp: (res: AmcFundTransactionResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: AmcFundTransactionResp) => {
      console.log('getFundTransaction response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getFundTransaction error -> ', error);
        if (error.status == StatusCode.Status403) {
          cbErr(true);
        }
      });
  }

}
