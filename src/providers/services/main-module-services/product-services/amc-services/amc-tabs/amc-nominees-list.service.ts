import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../../../common/enums/enums';
import { ApiUrl } from '../../../../../../common/constants/constants';
import { AmcNomineesListReq, AmcNomineesListResp, AmcNomineesListSerializer } from '../../../../../../dataModels/amc-nominees-list.model';
import { HttpService } from '../../../../../httpService';

const endPoint = ApiRouter.ApiRouter2 + 'esb/amc/getAccountNomineesList';

@Injectable()
export class AmcNomineesListService extends HttpService<AmcNomineesListResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new AmcNomineesListSerializer()
    );
  }

  getAccountNomineesList(data: AmcNomineesListReq, cbResp: (res: AmcNomineesListResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: AmcNomineesListResp) => {
      console.log('getAccountNomineesList response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200) && resp.accountNominees.length > 0) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getAccountNomineesList error -> ', error);
        if (error.status == StatusCode.Status403) {
          cbErr(true);
        }
      });
  }

}
