import { AmcClientContactsSerializer } from './../../../../../../dataModels/amc-client-contacts.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../../../common/enums/enums';
import { ApiUrl } from '../../../../../../common/constants/constants';
import { HttpService } from '../../../../../httpService';
import { AmcClientContactsResp, AmcClientContactsReq } from '../../../../../../dataModels/amc-client-contacts.model';

const endPoint = ApiRouter.ApiRouter2 + 'esb/amc/getClientContacts';

@Injectable()
export class AmcClientContactsService extends HttpService<AmcClientContactsResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new AmcClientContactsSerializer()
    );
  }

  getClientContacts(data: AmcClientContactsReq, cbResp: (res: AmcClientContactsResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: AmcClientContactsResp) => {
      console.log('getClientContacts response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getClientContacts error -> ', error);
        if (error.status == StatusCode.Status403) {
          cbErr(true);
        }
      });
  }

}
