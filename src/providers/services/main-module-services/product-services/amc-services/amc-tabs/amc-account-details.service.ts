import { ApiUrl } from '../../../../../../common/constants/constants';
import { AmcAccountDetailsResp, AmcAccountDetailsSerializer, AmcAccountDetailsReq } from '../../../../../../dataModels/amc-account-details.model';
import { HttpService } from '../../../../../httpService';
import { ApiRouter, StatusCode } from '../../../../../../common/enums/enums';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const endPoint = ApiRouter.ApiRouter2 + 'esb/amc/getAccountDetails';

@Injectable()
export class AmcAccountDetailsService extends HttpService<AmcAccountDetailsResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new AmcAccountDetailsSerializer()
    );
  }

  getAccountDetails(data: AmcAccountDetailsReq, cbResp: (res: AmcAccountDetailsResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: AmcAccountDetailsResp) => {
      console.log('getAccountDetails response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getAccountDetails error -> ', error);
        if (error.status == StatusCode.Status403) {
          cbErr(true);
        }
      });
  }

}
