import { BeneficiaryAction } from './../../../pages/main-module/product-module/pension/beneficiary/modify-beneficiary/modify-beneficiary';
import { Chart } from 'chart.js';
import { Component, ViewChild, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { BlueShades } from '../../constants/colors';
import { BeneficiaryAccountResp, Beneficiaries } from '../../../dataModels/get-beneficiary-account.model';
import { AlertService } from '../../../providers/plugin-services/alert.service';
import { TextInput } from 'ionic-angular';
import { RegexPattern } from '../../constants/constants';
import { Utils } from '../../utils/utils';

@Component({
  selector: 'edit-beneficiary',
  templateUrl: 'edit-beneficiary.html'
})
export class EditBeneficiaryComponent {
  
  @ViewChild('barChart') barChart;
  headerTitle: string = "Modify Beneficiary";
  chartBars: any;
  private beneficiaryAccResp: BeneficiaryAccountResp;
  beneficiaryCount: number = 0;
  disableAddBeneficiary: boolean;
  sumLeft: number = 0;
  portionErrorTxt: string = '';
  showPortionError: boolean;

  @Input('copyBeneficiaryDetails') copyBeneficiaryDetails: BeneficiaryAccountResp;
  @Input('beneficiaryMode') beneficiaryMode: string;
  @Input()
  set beneficiaryDetails(data: BeneficiaryAccountResp) {
    console.log("@Input beneficiaryDetails -> ", data);
    this.beneficiaryAccResp = data;

    // if (this.beneficiaryAccResp.beneficiaries && this.beneficiaryAccResp.beneficiaries.length > 0) {
    this.calculateBeneficiaryCount();
    this.reloadChart(this.beneficiaryAccResp.beneficiaries);
    // }
  }

  @Output('beneficiaryAction') beneficiaryAction = new EventEmitter();
  @Output('revertChanges') revertChanges = new EventEmitter();
  @Output('deleteBeneficiary') deleteBeneficiary = new EventEmitter();

  constructor(
    public alert: AlertService,
  ) {
  }

  createBarChart(chartLabels, chartData) {
    let ctx = this.barChart.nativeElement;
    this.chartBars = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: chartLabels,
        datasets: [{
          label: 'Viewers in millions',
          data: chartData,
          backgroundColor: this.generateColorArray(chartData.length), // array should have same number of elements as number of dataset
          // borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
          // borderWidth: 1
        }]
      },
      options: {
        // scales: {
        //   yAxes: [{
        //     ticks: {
        //       beginAtZero: true
        //     }
        //   }]
        // },
        legend: {
          display: false
        },
        cutoutPercentage: 65
      }
    });
  }

  reloadChart(beneficiaryData: Beneficiaries[]) {
    let chartLabels = [];
    let chartData = [];
    
    if (this.beneficiaryAccResp.beneficiaries && this.beneficiaryAccResp.beneficiaries.length > 0) {
      for(var i=0; i<beneficiaryData.length; i++) {
        if (beneficiaryData[i].action != BeneficiaryAction.DELETE) {
          chartLabels.push(beneficiaryData[i].beneficiary.firstName);
          chartData.push(beneficiaryData[i].beneficiary.lumpsum_entitlement);
        }
      }
    }
    this.createBarChart(chartLabels, chartData);
    this.percentageSum();
  }

  generateColorArray(num) {
    return BlueShades;
  }

  changePercentage(data: Beneficiaries, newf: TextInput) {
    if (RegexPattern.exceptZeroToNine.test(newf.value)) {
      let input = newf.value.replace(RegexPattern.exceptZeroToNine,'')
      newf.value = input;
      return;
    }
    data.beneficiary.lumpsum_entitlement = data.beneficiary.lumpsum_entitlement.replace(/^0+/, '');
    if (parseFloat(data.beneficiary.lumpsum_entitlement) > 100) {
      data.beneficiary.lumpsum_entitlement = "100";
      newf.value = "100";
    }
    else if (Utils.isEmpty(data.beneficiary.lumpsum_entitlement)) {
      data.beneficiary.lumpsum_entitlement = "0";
      newf.value = "0";
    }

    console.log("changePercentage ->", data);
    if (data.action != BeneficiaryAction.ADD) {
      data.action = BeneficiaryAction.MODIFY;
    }

    data.beneficiary.percentage = data.beneficiary.lumpsum_entitlement;
    this.reloadChart(this.beneficiaryAccResp.beneficiaries);
  }

  percentageSum() {
    let sum = 0;
    this.portionErrorTxt = "";
    this.showPortionError = false;

    this.beneficiaryAccResp.beneficiaries.filter(item => {
      if (item.action != BeneficiaryAction.DELETE) {
        sum += parseFloat(item.beneficiary.lumpsum_entitlement);
        if(parseFloat(item.beneficiary.lumpsum_entitlement) <= 0) {
          this.portionErrorTxt = 'You cannot save a beneficiary with 0% portion';
          this.showPortionError = true;
        }
      }
    });

    this.sumLeft = 100-sum;

    if (Utils.isEmpty(this.portionErrorTxt) && this.sumLeft != 0) {
      this.portionErrorTxt = "Beneficiary 'Portion Size' is not complete. Please ensure the sum is 100%. "+this.sumLeft+"% is remaining";
      this.showPortionError = true;
    }

    this.disableAddBeneficiary = false;
    if(sum >= 100) {
      this.disableAddBeneficiary = true;
    }
  }

  revertChangesClicked() {
    let alertTitle = "";
    let alertMsg = "All your changes will be lost. Do you still want to continue ?";
    let cancelTxt = "NO";
    let successTxt = "YES";
    this.alert.Alert.confirm(alertMsg, alertTitle, cancelTxt, successTxt).then(res => {
      this.revertChanges.emit(this.copyBeneficiaryDetails);
    }, err => {
    });
  }
    
  deleteBeneficiaryClicked(index) {
    let bfn = this.beneficiaryAccResp.beneficiaries[index].beneficiary.firstName;
    let bln = this.beneficiaryAccResp.beneficiaries[index].beneficiary.lastName;
    let nfn = this.beneficiaryAccResp.beneficiaries[index].nominee.firstName;
    let nln = this.beneficiaryAccResp.beneficiaries[index].nominee.lastName;
    let nomineeTxt = nfn ? "This will also remove '"+nfn+" "+nln+"' as their nominee" : "";

    let alertTitle = "Delete Beneficiary";
    let alertMsg = "Do you really want to remove '"+bfn+" "+bln+"' as a beneficiary? "+ nomineeTxt;
    let cancelTxt = "NO";
    let successTxt = "YES";
    
    this.alert.Alert.confirm(alertMsg, alertTitle, cancelTxt, successTxt).then(res => {
      this.beneficiaryAccResp.beneficiaries[index].action = BeneficiaryAction.DELETE;
      this.reloadChart(this.beneficiaryAccResp.beneficiaries);
      this.calculateBeneficiaryCount();
    }, err => {
    });
  }

  calculateBeneficiaryCount() {
    this.beneficiaryCount = 0;

    if (this.beneficiaryAccResp.beneficiaries && this.beneficiaryAccResp.beneficiaries.length > 0) {
      this.beneficiaryAccResp.beneficiaries.filter(item => {
        if (item.action != BeneficiaryAction.DELETE) {
          this.beneficiaryCount++;
        }
      });
    }
  }

  viewBeneficiary(beneficiaryData: Beneficiaries, index) {
    beneficiaryData.index = index;

    this.beneficiaryAction.emit({
      'beneficiaryMode': this.beneficiaryMode, 
      'beneficiaryData': beneficiaryData, 
      'beneficiaryDetails': this.beneficiaryAccResp
    });
  }

  addBeneficiary() {
    let beneficiaryData = new Beneficiaries();
    beneficiaryData.action = BeneficiaryAction.ADD;
    
    this.beneficiaryAction.emit({
      'beneficiaryMode': 'addMode', 
      'beneficiaryData': beneficiaryData, 
      'beneficiaryDetails': this.beneficiaryAccResp
    });
  }

}
