import { CreateAccountReq,CreateAccountResp,CreateAccountSerializer } from '../../../../dataModels/create-account.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';
import { HttpService } from '../../../httpService';
import { ApiUrl } from '../../../../common/constants/constants';

const endPoint = ApiRouter.ApiRouter2 + 'esb/amcBuyOnline/createAccount';

@Injectable()
export class CreateAccountService extends HttpService<CreateAccountResp>  {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new CreateAccountSerializer()
    );
  }

  createAccount(data: CreateAccountReq, cbResp: (res: CreateAccountResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: CreateAccountResp) => {
      console.log('createAccount response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('createAccount error -> ', error);
        // if (error.status == StatusCode.Status403) {
        //   cbErr(true);
        // }
      });
  }

}
