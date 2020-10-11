import { ApiRouter, StatusCode } from "../../../common/enums/enums";
import { Injectable } from "@angular/core";
import { HttpService } from "../../httpService";
import { ContactUsResp, ContactUsSerializer, ContactUsReq } from "../../../dataModels/contact-us.model";
import { ApiUrl } from "../../../common/constants/constants";
import { HttpClient } from "@angular/common/http";


const endPoint = ApiRouter.ApiRouter2 + 'lfr/core/addContact';

@Injectable()
export class ContactUsService extends HttpService<ContactUsResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new ContactUsSerializer()
    );
  }

  submitContactUs(data: ContactUsReq, cbResp: (res: ContactUsResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: ContactUsResp) => {
      console.log('submitContactUs response -> ', resp);
      cbResp(resp);
    },
    error => {
      console.log('submitContactUs error -> ',  error);
      if (error.status == StatusCode.Status403) {
        cbErr(true);
      }
    })
  }

}
