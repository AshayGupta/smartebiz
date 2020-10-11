import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../common/enums/enums';
import { UploadDocumentResp, UploadDocumentSerializer, UploadDocumentReq } from '../../../dataModels/upload-document.model';
import { HttpService } from '../../httpService';
import { ApiUrl } from '../../../common/constants/constants';

const endPoint = ApiRouter.ApiRouter2 + 'lfr/cust/upload/uploadDocument';

@Injectable()
export class UploadDocumentService extends HttpService<UploadDocumentResp>  {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new UploadDocumentSerializer()
    );
  }

  uploadDoc(data: UploadDocumentReq, cbResp: (res: UploadDocumentResp) => void, cbErr?: (err: HttpErrorResponse) => void) {
    super.create(data).subscribe((resp: UploadDocumentResp) => {
      console.log('uploadDoc response -> ', JSON.stringify(resp));
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      (error: HttpErrorResponse) => {
        console.log('uploadDoc error ->', error);
        cbErr(error);
      });
  }

}
