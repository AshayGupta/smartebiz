import { TransactionChargesSerializer, TransactionChargesReq } from './../../../../dataModels/transaction-charges.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';
import { HttpService } from '../../../httpService';
import { ApiUrl } from '../../../../common/constants/constants';
import { TransactionChargesResp } from '../../../../dataModels/transaction-charges.model';


const endPoint = ApiRouter.ApiRouter2 + 'esb/amcBuyOnline/getTransactionCharges';

@Injectable()
export class TransactionCharges extends HttpService<TransactionChargesResp>  {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new TransactionChargesSerializer()
    );
  }

  getTransactionCharges(data: TransactionChargesReq, cbResp: (res: TransactionChargesResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: TransactionChargesResp) => {
      console.log('getTransactionCharges response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getTransactionCharges error -> ', error);
        // if (error.status == StatusCode.Status403) {
        //   cbErr(true);
        // }
      });
  }

}
