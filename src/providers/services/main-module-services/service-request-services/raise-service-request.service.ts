import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';
import { HttpService } from '../../../httpService';
import { ApiUrl } from '../../../../common/constants/constants';
import { RaiseServiceRequestReq, RaiseServiceRequestResp, RaiseServiceRequestSerializer } from '../../../../dataModels/raise-service-request.model';


const endPoint = ApiRouter.ApiRouter2 + 'esb/sr/CreateServiceRequest'; 

@Injectable()
export class RaiseRequestService extends HttpService<RaiseServiceRequestResp>  {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new RaiseServiceRequestSerializer()
    ); 
  }

  addServiceRequest(data: RaiseServiceRequestReq, cbResp: (res: RaiseServiceRequestResp) => void, cbErr?: (err: HttpErrorResponse) => void) {
    super.create(data).subscribe((resp: RaiseServiceRequestResp) => {
      console.log('addServiceRequest response -> ', resp);
      if (resp.statusCode == StatusCode.Status200) {
        cbResp(resp)
      } 
    },
      error => {
        console.log('addServiceRequest error -> ', error);
        cbErr(error);
      });
  }

}
