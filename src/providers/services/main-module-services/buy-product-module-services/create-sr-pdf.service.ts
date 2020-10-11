import { CreateSrPdfResp, CreateSrPdfSerializer, CreateSrPdfReq } from './../../../../dataModels/create-sr-pdf.model';
import { ApiUrl } from './../../../../common/constants/constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';
import { HttpService } from '../../../httpService';


const endPoint = ApiRouter.ApiRouter2 + 'lfr/cust/upload/createSrPdf';

@Injectable()
export class CreateSrPdfService extends HttpService<CreateSrPdfResp>  {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new CreateSrPdfSerializer()
    );
  }

  createSrPdf(data: CreateSrPdfReq, cbResp: (res: CreateSrPdfResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: CreateSrPdfResp) => {
      console.log('CreateSrPdf response -> ', resp);
      cbResp(resp)
    },
      error => {
        console.log('CreateSrPdfResp error -> ', error);
        // if (error.status == StatusCode.Status403) {
        //   cbErr(true);
        // }
      });
  }

}
