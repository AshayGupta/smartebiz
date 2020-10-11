import { GeneratePartialAmountResp, GeneratePartialAmountSerializer, GeneratePartialAmountReq } from '../../../../dataModels/partial-withdraw.model';
import { ApiRouter, StatusCode } from "../../../../common/enums/enums";
import { Injectable } from "@angular/core";
import { HttpService } from "../../../httpService"; 
import { HttpClient } from "@angular/common/http";
import { ApiUrl } from "../../../../common/constants/constants";

const endPoint = ApiRouter.ApiRouter2 + 'esb/pw/getPartialAmount'; 
 
@Injectable() 
export class GeneratePartialAmountService extends HttpService<GeneratePartialAmountResp>  {

  constructor(http: HttpClient) {  
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new GeneratePartialAmountSerializer()
    );
  }

  getPartialAmount(data: GeneratePartialAmountReq, cbResp: (res: GeneratePartialAmountResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: GeneratePartialAmountResp) => {
      console.log('getPartialAmount response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getPartialAmount error -> ', error);
        if (error.status == StatusCode.Status403) {
          cbErr(true);
        }
      });
  }

}
