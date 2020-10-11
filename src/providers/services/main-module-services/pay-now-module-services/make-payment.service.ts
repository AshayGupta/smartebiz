import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';
import { HttpService } from '../../../httpService';
import { ApiUrl } from '../../../../common/constants/constants';
import { MakePaymentResp, MakePaymentReq, MakePaymentSerializer } from '../../../../dataModels/make-payment.model';

  
const endPoint = ApiRouter.ApiRouter2 + 'esb/makepayment';    

@Injectable()
export class MakePaymentService extends HttpService<MakePaymentResp>  {

  constructor(http: HttpClient) { 
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new MakePaymentSerializer()
    ); 
  }

  makePayment(data: MakePaymentReq, cbResp: (res: MakePaymentResp) => void, cbErr?: (err: any) => void) {
    super.create(data).subscribe((resp: MakePaymentResp) => {
      console.log('MakePayment response -> ', resp);
      if (resp.statusCode == StatusCode.Status200) {
        cbResp(resp)
      } 
    },  
      error => {
        console.log('MakePayment error -> ', error);
        cbErr(error)
      });
  }

}
