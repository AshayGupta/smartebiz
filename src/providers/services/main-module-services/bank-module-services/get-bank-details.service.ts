import { BankDetailsSerializer } from '../../../../dataModels/get-bank-details.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';
import { HttpService } from '../../../httpService';
import { ApiUrl } from '../../../../common/constants/constants';
import { BankDetailsReq, BankDetailsResp } from '../../../../dataModels/get-bank-details.model';


const endPoint = ApiRouter.ApiRouter2 + 'esb/pension/getBank';

@Injectable()
export class BankDetailsService extends HttpService<BankDetailsResp>  {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new BankDetailsSerializer()
    );
  }

  getBankDetails(data: BankDetailsReq, cbResp: (res: BankDetailsResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: BankDetailsResp) => {
      console.log('getBankAccounts response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getBankDetails error -> ', error);
        // if (error.status == StatusCode.Status403) {
        //   cbErr(true);
        // }
      });
  }

}
