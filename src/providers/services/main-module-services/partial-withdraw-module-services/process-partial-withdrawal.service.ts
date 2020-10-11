import { ProcessPartialWithdrawalResp, ProcessPartialWithdrawalSerializer, ProcessPartialWithdrawalReq } from '../../../../dataModels/process-partial-withdraw.model';
import { ApiRouter, StatusCode } from "../../../../common/enums/enums";
import { Injectable } from "@angular/core";
import { HttpService } from "../../../httpService"; 
import { HttpClient } from "@angular/common/http";
import { ApiUrl } from "../../../../common/constants/constants"; 

const endPoint = ApiRouter.ApiRouter2 + 'esb/pw/processPartialWithdrawal';  
 
@Injectable() 
export class ProcessPartialWithdrawalService extends HttpService<ProcessPartialWithdrawalResp>  {

  constructor(http: HttpClient) {   
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new ProcessPartialWithdrawalSerializer()
    );
  }
    
  getProcessPartialWithdrawal(data: ProcessPartialWithdrawalReq, cbResp: (res: ProcessPartialWithdrawalResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: ProcessPartialWithdrawalResp) => {
      console.log('getProcessPartialWithdrawal response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getProcessPartialWithdrawal error -> ', error);
        if (error.status == StatusCode.Status403) {
          cbErr(true);
        }
      });
  }

}
