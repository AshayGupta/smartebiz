import { ApiRouter, StatusCode } from "../../../../common/enums/enums";
import { Injectable } from "@angular/core";
import { HttpService } from "../../../httpService";
import { HttpClient } from "@angular/common/http";
import { ApiUrl } from "../../../../common/constants/constants";
import { RemoveQuoteResp, RemoveQuoteReq, RemoveQuoteSerializer } from "../../../../dataModels/remove-quote.model";


const endPoint = ApiRouter.ApiRouter2 + 'esb/loan/removeQuote';

@Injectable()
export class RemoveQuoteService extends HttpService<RemoveQuoteResp>  {

    constructor(http: HttpClient) {
        super(
            http,
            ApiUrl.baseUrl,
            endPoint,
            new RemoveQuoteSerializer()
        );
    }

    removeQuote(data: RemoveQuoteReq, cbResp: (res: RemoveQuoteResp) => void, cbErr?: (err: number) => void) {
        super.create(data).subscribe((resp: RemoveQuoteResp) => {
            console.log('getLoanQuote response -> ', resp);
           if (resp.statusCode == StatusCode.Status200) {
                cbResp(resp)
             }  
        },
            error => {
                console.log('getLoanQuote error -> ', error); 
                if (error.status == StatusCode.Status403) {
                    cbErr(StatusCode.Status403);
                }
                else {
                    cbErr(StatusCode.Status412)
                }
            });
    }

}
