import { TnCRequestResp, TnCRequestSerializer, TnCRequestReq } from './../../../../dataModels/tnc.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';
import { HttpService } from '../../../httpService';
import { ApiUrl } from '../../../../common/constants/constants';


const endPoint = ApiRouter.ApiRouter2 + 'esb/amcBuyOnline/getTermsAndConditions';

@Injectable()
export class TnCRequestService extends HttpService<TnCRequestResp>  {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new TnCRequestSerializer()
    );
  }

  getTnCRequest(data: TnCRequestReq, cbResp: (res: TnCRequestResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: TnCRequestResp) => {
      console.log('getTnCRequest response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getTnCRequest error -> ', error);
        // if (error.status == StatusCode.Status403) {
        //   cbErr(true);
        // }
      });
  }

}
