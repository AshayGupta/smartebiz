import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiRouter, StatusCode } from "../../../common/enums/enums";
import { Injectable } from "@angular/core";
import { HttpService } from "../../httpService";
import { ApiUrl } from "../../../common/constants/constants";
import { UpdateProfilePicSerializer, UpdateProfilePicResp, UpdateProfilePicReq } from '../../../dataModels/update-profile-pic.model';

const endPoint = ApiRouter.ApiRouter2 + 'lfr/cust/updateProfilePicture';

@Injectable()
export class UpdateProfilePicService extends HttpService<UpdateProfilePicResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new UpdateProfilePicSerializer()
    );
  }

  updateProfilePic(data: UpdateProfilePicReq, cbResp: (res: UpdateProfilePicResp) => void, cbErr?: (err: any) => void) {
    super.create(data).subscribe((resp: UpdateProfilePicResp) => {
      console.log('updateProfilePic response -> ', JSON.stringify(resp));
      if (resp.statusCode == StatusCode.Status200 && resp) {
        cbResp(resp);
      }
      else if (resp.statusCode == StatusCode.Status510) {
        cbErr(resp.message);
      }
    },
      (error: HttpErrorResponse) => {
        console.log('updateProfilePic error -> ', JSON.stringify(error));
        cbErr(error.statusText);
      });
  }



}
