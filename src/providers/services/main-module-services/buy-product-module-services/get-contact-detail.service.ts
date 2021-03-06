import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../common/enums/enums';
import { HttpService } from '../../../httpService';
import { ContactResp, ContactSerializer, ContactReq } from '../../../../dataModels/get-contact.model';
import { ApiUrl } from '../../../../common/constants/constants';

const endPoint = ApiRouter.ApiRouter2 + 'esb/cust/getContacts';

@Injectable()
export class GetContactDetailService extends HttpService<ContactResp>  {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new ContactSerializer()
    );
  }

  getContacts(data: ContactReq, cbResp: (res) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp) => {
      console.log('getContact response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200)) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getContact error -> ', error);
        // if (error.status == StatusCode.Status403) {
        //   cbErr(true);
        // }
      });
  }

}
