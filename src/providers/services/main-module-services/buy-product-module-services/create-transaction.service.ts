import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';
import { HttpService } from '../../../httpService';
import { ApiUrl } from '../../../../common/constants/constants';
import { CreateTransactionResp, CreateTransactionSerializer, CreateTransactionReq } from './../../../../dataModels/create-transaction.model';

// const endPoint = ApiRouter.ApiRouter3 + 'createTransaction';
const endPoint = ApiRouter.ApiRouter2 + 'esb/mpesa/createTransaction';

@Injectable()
export class CreateTransactionService extends HttpService<CreateTransactionResp>  {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new CreateTransactionSerializer()
    );
  }

  createTransaction(data: CreateTransactionReq, cbResp: (res: CreateTransactionResp) => void, cbErr?: (err: any) => void) {
    super.create(data).subscribe((resp: CreateTransactionResp) => {
      console.log('CreateTransaction response -> ', resp);
      if (resp.statusCode == StatusCode.Status200) {
        cbResp(resp)
      }
    },
      error => {
        console.log('CreateTransaction error -> ', error);
        // if (error.status == StatusCode.Status403) {
        //   cbErr(true);
        // }
      });
  }

}
