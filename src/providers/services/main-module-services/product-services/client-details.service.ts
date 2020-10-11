import { ClientDetailsReq, ClientDetailsSerializer, ClientDetailsResp } from '../../../../dataModels/client-details.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';
import { ApiUrl } from '../../../../common/constants/constants';
import { HttpService } from '../../../httpService';

const endPoint = ApiRouter.ApiRouter2 + 'esb/erp/getClientDetails';

@Injectable()
export class ClientDetailsService extends HttpService<ClientDetailsResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new ClientDetailsSerializer()
    );
  }

  getClientDetails(data: ClientDetailsReq, cbResp: (res: ClientDetailsResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: ClientDetailsResp) => {
      console.log('getClientDetails response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {        
        cbResp(resp)
      }
    },
      error => {
        console.log('getClientDetails error -> ', error);
        if (error.status == StatusCode.Status403) {
          cbErr(true);
        }
      });
  }

}
