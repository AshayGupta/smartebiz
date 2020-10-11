import { ApiRouter, StatusCode } from "../../../common/enums/enums";
import { Injectable } from "@angular/core";
import { HttpService } from "../../httpService";
 import { ApiUrl } from "../../../common/constants/constants";
import { HttpClient } from "@angular/common/http";
import { SyncVisitorsRequestSerializer, SyncVisitorsRequestResp, SyncVisitorsRequestReq } from "../../../dataModels/sync-visitors.model";


const endPoint = ApiRouter.ApiRouter1 + 'sb/syncVisitors';

@Injectable()
export class SyncVisitorsService extends HttpService<SyncVisitorsRequestResp> {

  constructor(http: HttpClient) { 
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new SyncVisitorsRequestSerializer() 
    );
  }

  syncVisitors(data: SyncVisitorsRequestReq, cbResp: (res: SyncVisitorsRequestResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: SyncVisitorsRequestResp) => {
      console.log('SyncVisitorsRequest response -> ', resp);
      cbResp(resp);
    },
    error => { 
      console.log('SyncVisitors error -> ',  error);
      if (error.status == StatusCode.Status403) {
        cbErr(true);
      }
    })
  }

}
