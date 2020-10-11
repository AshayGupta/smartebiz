import { ApiRouter, StatusCode } from "../../../../common/enums/enums";
import { Injectable } from "@angular/core";
import { HttpService } from "../../../httpService";
import { HttpClient } from "@angular/common/http";
import { ApiUrl } from "../../../../common/constants/constants";
import { AdvanceQuoteSerializer, AdvanceQuoteResp, AdvanceQuoteReq } from "../../../../dataModels/advance-quote.model";

const endPoint = ApiRouter.ApiRouter2 + 'esb/loan/advanceQuote';

@Injectable()
export class AdvanceQuoteService extends HttpService<AdvanceQuoteResp>  {

    constructor(http: HttpClient) {
        super(
            http,
            ApiUrl.baseUrl,
            endPoint,
            new AdvanceQuoteSerializer()
        );
    }

    getAdvanceQuote(data: AdvanceQuoteReq, cbResp: (res: AdvanceQuoteResp) => void, cbErr?: (err: boolean) => void) {
        super.create(data).subscribe((resp: AdvanceQuoteResp) => {
            console.log('getAdvanceQuote response -> ', resp);
            if ((resp.statusCode == StatusCode.Status200)) {
                cbResp(resp)
            }
        },
            error => {
                console.log('getAdvanceQuote error -> ', error);
                if (error.status == StatusCode.Status403) {
                    cbErr(true);
                }
            });
    }

}
