import { LoanQuoteResp, LoanQuoteReq, LoanQuoteSerializer } from './../../../../dataModels/loan-quote.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../../../httpService';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';
import { ApiUrl } from '../../../../common/constants/constants';


const endPoint = ApiRouter.ApiRouter2 + 'esb/loan/getLoanQuote';

@Injectable()
export class LoanQuoteService extends HttpService<LoanQuoteResp>  {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new LoanQuoteSerializer()
    );
  }

  getLoanQuote(data: LoanQuoteReq, cbResp: (res: LoanQuoteResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: LoanQuoteResp) => {
      console.log('getLoanQuote response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200) || (resp.statusCode == StatusCode.Status412)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getLoanQuote error -> ', error);
        if (error.status == StatusCode.Status403) {
          cbErr(true);
        }
      });
  }

}
