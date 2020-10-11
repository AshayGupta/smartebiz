import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiRouter, StatusCode } from "../../../common/enums/enums";
import { Injectable } from "@angular/core";
import { HttpService } from "../../httpService";
import { ApiUrl } from "../../../common/constants/constants";
import { GetProfilePicResp, GetProfilePicSerializer, GetProfilePicReq } from '../../../dataModels/get-profile-pic.model';

const endPoint = ApiRouter.ApiRouter2 + 'lfr/cust/getProfilePicture';

@Injectable()
export class GetProfilePicService extends HttpService<GetProfilePicResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new GetProfilePicSerializer()
    );
  }

  getProfilePic(data: GetProfilePicReq, cbResp: (res: GetProfilePicResp) => void, cbErr?: (err: HttpErrorResponse) => void) {
    super.create(data).subscribe((resp: GetProfilePicResp) => {
      console.log('GetProfilePic response -> ', resp);
      if (resp.statusCode == StatusCode.Status200 && resp) {
        cbResp(resp);
      }
    },
      error => {
        console.log('GetProfilePic error -> ', JSON.stringify(error));
        if (error.status == StatusCode.Status403) {
          cbErr(error);
        }
      });
  }



}
