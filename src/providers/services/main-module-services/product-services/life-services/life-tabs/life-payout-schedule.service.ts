import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../../../common/enums/enums';
import { ApiUrl } from '../../../../../../common/constants/constants';
import { HttpService } from '../../../../../httpService';
import { LifePayoutScheduleResp, LifePayoutScheduleReq, LifePayoutScheduleSerializer } from '../../../../../../dataModels/life-payout-schedule.model';


const endPoint = ApiRouter.ApiRouter2 + 'esb/life/getAccountBonusSchedule';

// const endPoint = ApiRouter.ApiRouter3 + 'getAccountBonusSchedule'; 


@Injectable()
export class LifePayoutScheduleService extends HttpService<LifePayoutScheduleResp> {

  constructor(http: HttpClient) {
    super(
      http,
      ApiUrl.baseUrl,
      endPoint,
      new LifePayoutScheduleSerializer()
    );
  }

  getPayoutSchedule(data: LifePayoutScheduleReq, cbResp: (res: LifePayoutScheduleResp) => void, cbErr?: (err: boolean) => void) {
    super.create(data).subscribe((resp: LifePayoutScheduleResp) => {
      console.log('getPayoutSchedule response -> ', resp);
      if ((resp.statusCode == StatusCode.Status200) && resp.payoutSchedule.length > 0) {
        cbResp(resp)
      }
    },
      error => {
        console.log('getPayoutSchedule error -> ', error);
        if (error.status == StatusCode.Status403) {
          cbErr(true);
        }
      });
  }

}
