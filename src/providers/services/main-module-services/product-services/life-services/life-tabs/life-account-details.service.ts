import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../../../common/enums/enums';
import { LifeAccountDetailsResp, LifeAccountDetailsSerializer, LifeAccountDetailsReq } from '../../../../../../dataModels/life-account-details.model';
import { ApiUrl } from '../../../../../../common/constants/constants';
import { HttpService } from '../../../../../httpService';

const endPoint = ApiRouter.ApiRouter2 + 'esb/life/getAccountsDetails';

@Injectable()
export class LifeAccountDetailsService extends HttpService<LifeAccountDetailsResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new LifeAccountDetailsSerializer()
    );
  }

  getAccountDetails(data: LifeAccountDetailsReq, cbResp: (res: LifeAccountDetailsResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: LifeAccountDetailsResp) => {
      console.log('getAccountDetails response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200) && resp.accountDetails.length > 0) {
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
