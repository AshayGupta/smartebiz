import { AddBeneficiaryResp, AddBeneficiarySerializer, AddBeneficiaryReq } from './../../../../../dataModels/add-beneficiary.mode';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRouter, StatusCode } from '../../../../../common/enums/enums';
import { HttpService } from '../../../../httpService';
import { ApiUrl } from '../../../../../common/constants/constants';


const endPoint = ApiRouter.ApiRouter2 + 'esb/pension/addBeneficiary';

@Injectable()
export class AddBeneficiaryService extends HttpService<AddBeneficiaryResp> {

    constructor(http: HttpClient) {
        super(
            http,
            ApiUrl.baseUrl,
            endPoint,
            new AddBeneficiarySerializer()
        );
    }

    addBeneficiary(data: AddBeneficiaryReq, cbResp: (res: AddBeneficiaryResp) => void, cbErr?: (err: HttpErrorResponse) => void) {
        super.create(data).subscribe((resp: AddBeneficiaryResp) => {
            console.log('addBeneficiary response ->', resp);
            if ((resp.statusCode == StatusCode.Status200)) {
                cbResp(resp);
            }
        },
            (error: HttpErrorResponse) => {
                console.log('addBeneficiary error -> ', error);
                cbErr(error);
            });
    }

}

