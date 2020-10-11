import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';
import { HttpService } from '../../../httpService';
import { ApiUrl } from '../../../../common/constants/constants';
import { BankAccountsResp, BankAccountsSerializer, BankAccountsReq } from '../../../../dataModels/get-bank-accounts.model';


const endPoint = ApiRouter.ApiRouter2 + 'esb/cust/getBankAccounts';

@Injectable()
export class BankAccountsService extends HttpService<BankAccountsResp>  {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new BankAccountsSerializer()
    );
  }

  getBankAccounts(data: BankAccountsReq, cbResp: (res: BankAccountsResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: BankAccountsResp) => {
      console.log('getBankAccounts response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getBankAccounts error -> ', error);
        // if (error.status == StatusCode.Status403) {
        //   cbErr(true);
        // }
      });
  }

}
