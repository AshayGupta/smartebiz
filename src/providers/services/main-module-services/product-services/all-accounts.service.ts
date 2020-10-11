import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';
import { ApiUrl } from '../../../../common/constants/constants';
import { HttpService } from '../../../httpService';
import { AllAccountsReq, AllAccountsResp, AllAccountsSerializer } from './../../../../dataModels/all-accounts.model';

const endPoint = ApiRouter.ApiRouter3 + 'getAccountsList';

@Injectable()
export class GetAllAccountsService extends HttpService<AllAccountsResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new AllAccountsSerializer()
    );
  }

  getAllAccounts(data: AllAccountsReq, cbResp: (res: AllAccountsResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: AllAccountsResp) => {
      console.log('getAllAccounts response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getAllAccounts error -> ', error);
        if (error.status == StatusCode.Status403) {
          cbErr(true);
        }
      });
  }

}
