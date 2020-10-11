import { HttpService } from "../../../httpService";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiUrl } from "../../../../common/constants/constants";
import { ApiRouter, StatusCode } from "../../../../common/enums/enums";
import { GetTransactionNumberResp, GetTransactionNumberReq, GetTransactionNumberSerializer } from "../../../../dataModels/get-transaction-number.model";

const endPoint = ApiRouter.ApiRouter2 + 'lfr/cust/upload/getTransactionNumber';

@Injectable()
export class GetTransactionNumberService extends HttpService<GetTransactionNumberResp>  {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new GetTransactionNumberSerializer()
    );
  }

  getTransactionNumber(data: GetTransactionNumberReq, cbResp: (res: GetTransactionNumberResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: GetTransactionNumberResp) => {
      console.log('getTransactionNumber response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getTransactionNumber error -> ', error);
        // if (error.status == StatusCode.Status403) {
        //   cbErr(true);
        // }
      });
  }

}
