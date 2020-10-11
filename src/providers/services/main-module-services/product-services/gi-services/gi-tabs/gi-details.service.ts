import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../../../common/enums/enums';
import { HttpService } from '../../../../../httpService';
import { ApiUrl } from '../../../../../../common/constants/constants';
import { GIDetailsResp, GIDetailsReq, GIDetailsSerializer } from '../../../../../../dataModels/gi-details.model';


const endPoint = ApiRouter.ApiRouter2 + 'esb/gen/getGiDetails';

@Injectable()
export class GIDetailsService extends HttpService<GIDetailsResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new GIDetailsSerializer()
    );
  }

  getDetails(data: GIDetailsReq, cbResp: (res: GIDetailsResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: GIDetailsResp) => {
      console.log('getDetails response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getDetails error -> ', error);
        if (error.status == StatusCode.Status403) {
          cbErr(true);
        }
      });
  }

}
