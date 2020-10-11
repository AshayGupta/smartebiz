import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiRouter, StatusCode } from "../../../../common/enums/enums";
import { HttpService } from "../../../httpService";
import { UpdateActivityResp, UpdateActivitySerializer, UpdateActivityReq } from "../../../../dataModels/life-update-activity.model";
import { ApiUrl } from "../../../../common/constants/constants";

const endPoint = ApiRouter.ApiRouter2 + 'esb/sr/createActivity'; 
 
@Injectable() 
export class UpdateActvity extends HttpService<UpdateActivityResp>  {

  constructor(http: HttpClient) {  
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new UpdateActivitySerializer()
    );
  }

  createActivity(data: UpdateActivityReq, cbResp: (res: UpdateActivityResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: UpdateActivityResp) => {
      console.log('createActivity response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('createActivity error -> ', error);
        if (error.status == StatusCode.Status403) {
          cbErr(true);
        }
      });
  }

}
