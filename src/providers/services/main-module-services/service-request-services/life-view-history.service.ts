import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiRouter, StatusCode } from "../../../../common/enums/enums";
import { HttpService } from "../../../httpService";
import { ViewHistoryResp, ViewHistorySerializer, ViewHistoryReq } from "../../../../dataModels/life-view-history.model";
import { ApiUrl } from "../../../../common/constants/constants";

const endPoint = ApiRouter.ApiRouter2 + 'esb/sr/getActivity'; 
 
@Injectable() 
export class GetActvity extends HttpService<ViewHistoryResp>  {

  constructor(http: HttpClient) {  
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new ViewHistorySerializer()
    );
  }

  getActivity(data: ViewHistoryReq, cbResp: (res: ViewHistoryResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: ViewHistoryResp) => {
      console.log('getActivity response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getActivity error -> ', error);
        if (error.status == StatusCode.Status403) {
          cbErr(true);
        }
      });
  }

}
