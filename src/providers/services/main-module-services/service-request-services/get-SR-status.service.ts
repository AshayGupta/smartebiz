import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';
import { HttpService } from '../../../httpService';
import { ApiUrl } from '../../../../common/constants/constants';
import { SRStatusResp, SRStatusReq, SRStatusSerializer } from '../../../../dataModels/sr-status.model';

const endPoint = ApiRouter.ApiRouter2 + 'esb/sr/getservicereq';


@Injectable()
export class GetSRStatusService extends HttpService<SRStatusResp>  {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new SRStatusSerializer()
    );
  }


  getSRStatus(data: SRStatusReq, cbResp: (res: SRStatusResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: SRStatusResp) => {
        console.log('getSRStatus response -> ', resp);
        if (resp.statusCode == StatusCode.Status200) {
          cbResp(resp)
        } 
      },  
        error => {
          console.log('getSRStatus error -> ', error);
          cbErr(error)
        });
  }

}
