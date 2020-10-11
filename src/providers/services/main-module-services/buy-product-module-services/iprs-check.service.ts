import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';
import { HttpService } from '../../../httpService';
import { IprsResp, IprsSerializer, IprsReq } from '../../../../dataModels/iprs-check.model';
import { ApiUrl } from '../../../../common/constants/constants';

const endPoint = ApiRouter.ApiRouter2 + 'esb/amcBuyOnline/iprsCheck';

@Injectable()
export class IprsService extends HttpService<IprsResp>  {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new IprsSerializer()
    );
  }

  checkIprs(data: IprsReq, cbResp: (res: IprsResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: IprsResp) => {
      console.log('checkIprs response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('checkIprs error -> ', error);
        // if (error.status == StatusCode.Status403) {
        //   cbErr(true);
        // }
      });
  }

}
