import { CreateSwitchOrderResp, CreateSwitchOrderSerializer, CreateSwitchOrderReq } from './../../../../dataModels/create-switch-order.model';
import { ApiUrl } from './../../../../common/constants/constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';
import { HttpService } from '../../../httpService';


const endPoint = ApiRouter.ApiRouter2 + 'esb/amcBuyOnline/createSwitchOrder';

@Injectable()
export class CreateSwitchOrderService extends HttpService<CreateSwitchOrderResp>  {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new CreateSwitchOrderSerializer()
    );
  }

  createSwitchOrder(data: CreateSwitchOrderReq, cbResp: (res: CreateSwitchOrderResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: CreateSwitchOrderResp) => {
      console.log('createSwitchOrder response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('createSwitchOrder error -> ', error);
        // if (error.status == StatusCode.Status403) {
        //   cbErr(true);
        // }
      });
  }

}
