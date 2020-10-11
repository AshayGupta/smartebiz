import { GetPdfFileAsBase64Req, GetPdfFileAsBase64Resp, GetPdfFileAsBase64Serializer } from './../../../../dataModels/get-pdf-file-as-base64.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';
import { HttpService } from '../../../httpService';
import { ApiUrl } from '../../../../common/constants/constants';

const endPoint = ApiRouter.ApiRouter2 + 'lfr/cust/upload/getPdfFileAsBase64';

@Injectable()
export class GetPdfFileAsBase64Service extends HttpService<GetPdfFileAsBase64Resp>  {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new GetPdfFileAsBase64Serializer()
    );
  }

  getPdfFileAsBase64(data: GetPdfFileAsBase64Req, cbResp: (res:GetPdfFileAsBase64Resp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp:GetPdfFileAsBase64Resp) => {
      console.log('getPdfFileAsBase64 response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getPdfFileAsBase64 error -> ', error);
        // if (error.status == StatusCode.Status403) {
        //   cbErr(true);
        // }
      });
  }

}
