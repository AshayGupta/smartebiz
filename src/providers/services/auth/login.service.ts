import { LoginSerializer, LoginResp, LoginReq } from './../../../dataModels/login.model';
import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../common/constants/constants';
import { HttpService } from '../../httpService';
import { ApiRouter, StatusCode } from '../../../common/enums/enums';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

const endPoint = ApiRouter.ApiRouter2 + 'lfr/cust/signin';

@Injectable()
export class LoginService extends HttpService<LoginResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new LoginSerializer()
    );
  }

  doLogin(data: LoginReq, cbResp: (res: LoginResp) => void, cbErr?: (err: HttpErrorResponse) => void) {
    super.create(data).subscribe((resp) => {
      console.log('doLogin response ->', resp);
      if (resp.statusCode == StatusCode.Status200) {
        cbResp(resp);
      }
    },
      (error: HttpErrorResponse) => {
        console.log('doLogin error ->', error);
        cbErr(error);
      });
  }

}

export class Logout {
  static doLogout() {
    // localStorage.setItem(LocalStorageKey.IsLoggedIn, JSON.stringify(false));
    localStorage.clear();
  }
}

