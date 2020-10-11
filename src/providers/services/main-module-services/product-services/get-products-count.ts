import { DashboardReq, DashboardSerializer, DashboardResp } from '../../../../dataModels/dashboard.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';
import { ApiUrl } from '../../../../common/constants/constants';
import { HttpService } from '../../../httpService';

const endPoint = ApiRouter.ApiRouter3 + 'getAccountsCount';

@Injectable()
export class AccountsCountService extends HttpService<DashboardResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new DashboardSerializer()
    );
  }

  getAccountsCount(data: DashboardReq, cbResp: (res: DashboardResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: DashboardResp) => {
      console.log('getAccountsCount response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getAccountsCount error -> ', error);
        if (error.status == StatusCode.Status403) {
          cbErr(true);
        }
      });
  }

}
