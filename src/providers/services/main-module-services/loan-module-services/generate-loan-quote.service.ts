import { GenerateLoanQuoteResp, GenerateLoanQuoteSerializer, GenerateLoanQuoteReq } from './../../../../dataModels/generate-loan-quote.model';
import { ApiRouter, StatusCode } from "../../../../common/enums/enums";
import { Injectable } from "@angular/core";
import { HttpService } from "../../../httpService";
import { HttpClient } from "@angular/common/http";
import { ApiUrl } from "../../../../common/constants/constants";

const endPoint = ApiRouter.ApiRouter2 + 'esb/loan/generateLoanQuote';

@Injectable()
export class GenerateLoanQuoteService extends HttpService<GenerateLoanQuoteResp>  {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new GenerateLoanQuoteSerializer()
    );
  }

  getGenerateLoanQuote(data: GenerateLoanQuoteReq, cbResp: (res: GenerateLoanQuoteResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: GenerateLoanQuoteResp) => {
      console.log('getGenerateLoanQuote response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getGenerateLoanQuote error -> ', error);
        if (error.status == StatusCode.Status403) {
          cbErr(true);
        }
      });
  }

}
