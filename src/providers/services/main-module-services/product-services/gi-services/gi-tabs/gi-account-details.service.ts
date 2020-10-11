import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../../../common/enums/enums';
import { HttpService } from '../../../../../httpService';
import { GiAccountDetailsResp, GiAccountDetailsSerializer, GiAccountDetailsReq } from '../../../../../../dataModels/gi-account-details.model';
import { ApiUrl } from '../../../../../../common/constants/constants';


const endPoint = ApiRouter.ApiRouter2 + 'esb/gen/getAccountsDetails';

@Injectable()
export class GiAccountDetailsService extends HttpService<GiAccountDetailsResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new GiAccountDetailsSerializer()
    );
  }

  getAccountDetails(data: GiAccountDetailsReq, cbResp: (res: GiAccountDetailsResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: GiAccountDetailsResp) => {
      console.log('getAccountDetails response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200) && resp.policyDetails.length > 0) {
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
