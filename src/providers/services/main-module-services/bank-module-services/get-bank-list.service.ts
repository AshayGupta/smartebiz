import { BankListResp, BankListSerializer, BankListReq } from '../../../../dataModels/get-bank-list.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';
import { HttpService } from '../../../httpService';
import { ApiUrl } from '../../../../common/constants/constants';


const endPoint = ApiRouter.ApiRouter2 + 'esb/amcBuyOnline/getBankList';

@Injectable()
export class BankListService extends HttpService<BankListResp>  {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new BankListSerializer()
    );
  }

  getBankList(data: BankListReq, cbResp: (res: BankListResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: BankListResp) => {
      console.log('getBankList response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getBankList error -> ', error);
        // if (error.status == StatusCode.Status403) {
        //   cbErr(true);
        // }
      });
  }

}
