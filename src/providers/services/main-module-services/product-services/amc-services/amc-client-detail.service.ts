import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../../common/enums/enums';
import { HttpService } from '../../../../httpService';
import { ClientDetailsResp, ClientDetailsSerializer, ClientDetailsReq } from '../../../../../dataModels/client-details.model';
import { ApiUrl } from '../../../../../common/constants/constants';


const endPoint = ApiRouter.ApiRouter2 + 'esb/amc/getClientDetails';

@Injectable()
export class AmcClientDetailsService extends HttpService<ClientDetailsResp> {

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
      console.log('getAmcClientDetails response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getAmcClientDetails error -> ', error);
        if (error.status == StatusCode.Status403) {
          cbErr(true);
        }
      });
  }

}
