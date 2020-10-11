import { FinalDocProcessSerializer, FinalDocProcessReq } from './../../../../dataModels/final-doc-process.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';
import { HttpService } from '../../../httpService';
import { ApiUrl } from '../../../../common/constants/constants';

const endPoint = ApiRouter.ApiRouter2 + 'lfr/cust/upload/finalDocProcess';

@Injectable()
export class FinalDocProcessService extends HttpService<any>  {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new FinalDocProcessSerializer()
    );
  }

  finalDocProcess(data: FinalDocProcessReq, cbResp: (res:any) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp) => {
      console.log('finalDocProcess response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('finalDocProcess error -> ', error);
        // if (error.status == StatusCode.Status403) {
        //   cbErr(true);
        // }
      });
  }

}
