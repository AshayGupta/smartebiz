import { HttpClient } from '@angular/common/http';
import { LogonResp, LogonSerializer } from './../../../dataModels/logon.model';
import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../common/constants/constants';
import { HttpService } from '../../httpService';
import { ApiRouter, LocalStorageKey } from '../../../common/enums/enums';

const endPoint = ApiRouter.ApiRouter1 + 'apps/logon';

@Injectable()
export class LogonService extends HttpService<LogonResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new LogonSerializer()
    );
  }

  getToken(cb: (isTokenValid: boolean) => void) {
    super.logonService().subscribe((resp: LogonResp) => {
        console.log('logonService response ->', resp);
        if (resp) {
            localStorage.setItem(LocalStorageKey.BearerToken, resp.token);
            cb(true);
        }
        else {
          cb(false);
        }
    },
    error => {
        console.log('logonService error ->', error);
        cb(false);
    });
  }

}

