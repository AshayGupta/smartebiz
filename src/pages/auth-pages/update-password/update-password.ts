import { UpdatePasswordService } from './../../../providers/services/auth/update-password.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { PasswordValidator } from '../../../common/validators/password.validator';
import { LogonService } from '../../../providers/services/auth/logon.service';
import { StatusCode, LocalStorageKey } from '../../../common/enums/enums';
import { AlertService } from '../../../providers/plugin-services/alert.service';
import { SetPasswordReq, SetPasswordResp } from '../../../dataModels/setPassword.model';
import { PageTrack } from '../../../common/decorators/page-track';

@PageTrack()
@IonicPage()
@Component({
  selector: 'page-update-password',
  templateUrl: 'update-password.html',
})
export class UpdatePasswordPage {

  headerTitle: string;
  updatePasswordForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    public logonService: LogonService,
    public updatePasswordService: UpdatePasswordService,
    public alertService: AlertService
  ) {
    this.validateForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdatePasswordPage');
  }

  validateForm() {
    this.updatePasswordForm = this.formBuilder.group({
      currentPassword: ['', Validators.compose([Validators.required])],
      newPassword: ['', Validators.compose([Validators.required])],
      confirmPassword: ['', Validators.compose([Validators.required, PasswordValidator.Match('newPassword', 'confirmPassword')])],
    });
  }


  onSubmit() {
    let passReq = new SetPasswordReq();
    passReq.idOptionKey = 'nationalId'; //localStorage.getItem(LocalStorageKey.NationalIDType);
    passReq.idValue = localStorage.getItem(LocalStorageKey.NationalID);
    passReq.currentPassword = this.updatePasswordForm.controls.currentPassword.value;
    passReq.password = this.updatePasswordForm.controls.newPassword.value;
    passReq.confirmPassword = this.updatePasswordForm.controls.confirmPassword.value;

    this.updatePasswordService.updatePassword(passReq, (resp: SetPasswordResp) => {
      if (resp.status == 200) {
        this.alertService.Alert.alert('Password is updated').then((data) => {
          this.navCtrl.pop();
        });
      } else if (resp.status == 512) {
        this.alertService.Alert.alert(resp.msg);
        this.updatePasswordForm.reset();
      } else {
        this.alertService.Alert.alert("Something went wrong please try again.");
        this.updatePasswordForm.reset();
      }
    },
      (error) => {
        if (error.status == StatusCode.Status403) {
          this.logonService.getToken((isTokenValid: boolean) => {
            if (isTokenValid) {
              this.onSubmit();
            }
          })
        }
        else {
          this.alertService.Alert.alert(error.error.message);
        }

      });
  }

}
