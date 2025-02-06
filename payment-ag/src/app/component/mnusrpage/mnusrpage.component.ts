import { Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PopupComponent } from "../popup/popup.component";
import { CommonModule } from '@angular/common';
import { SearchInv } from '../../interface/payment-interface';
import { ApiService } from '../../service/api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-mnusrpage',
    imports: [
      MatIconModule
      , PopupComponent
      , CommonModule
      , FormsModule
      , ReactiveFormsModule
    ],
  templateUrl: './mnusrpage.component.html',
  styleUrl: './mnusrpage.component.css'
})
export class MnusrpageComponent {
  public paymentForm!: FormGroup;
  public filterData: any[] = [];
  public allData: any[] = []; 
  public customerLabel: string = '';
  public warning_pop: boolean = false;
  public payment_pop: boolean = false;
  public success_pop: boolean = false;
  public fail_pop: boolean = false;
  public warning_search: boolean = false;
  public isVisible: any;  
  public headerForm!: FormGroup;
  public searchData = {} as SearchInv;
  public loadingApp: EventEmitter<boolean> = new EventEmitter(false);

  constructor(
    private formBuilder: FormBuilder
    , private api: ApiService
  ) {
    this.headerForm = this.formBuilder.group({
      cuscode: [{ value: null, disabled: false }]
      , invNo: [{ value: null, disabled: false }]
    });
  }

  public ngOnInit(): void {
    this.setLoading(true);
    this.loadData();
    this.setLoading(false);
  }

  private populateForm(): void {
    this.searchData.customer_code = this.headerForm.controls['cuscode'].value;
    this.searchData.invno = this.headerForm.controls['invNo'].value;
  }


  public loadData(): void {
   // 
  }

  public async searchPayment(): Promise<void> {
    this.setLoading(true);
    this.populateForm()
    
    if (this.searchData.customer_code && this.searchData.invno){
      // this.api.testConnect(this.searchData).forEach((result: any) => {
      //   if(result){
      //       console.log(result);
      //   } else {
      //       console.log('alert message');
      //   }
      // });
      
      // const result = await firstValueFrom(this.api.getData(this.searchData));
      // if (result) {
      //   console.log(result);
      // } else {
      //   console.log('alert message');
      // }
      console.log('alert message');
      // this.api.getData(this.searchData).subscribe({
      //   next: (result: any) => {                     
      //     if (result) {
      //       console.log(result);
      //     } else {
      //       console.log('alert message');
      //     }
      //   },
      //   error: (err: any) => {
      //     console.error('API call failed:', err);
      //     console.log('alert message');
      //   },
      //   complete: () => {
      //     this.setLoading(false);
      //   }
      // });
    } else {
      this.popup('search');
    }
  }

  public createPayment(): void {
    // const { cuscode, invNo } = this.paymentForm.value;
    // this.paymentService.createPayment(cuscode, invNo).subscribe((response) => {
    //   // Handle the response and show success message or navigate
    // });
  }

  public toggleSelectAll(table: string): void {
    const data = table === 'filtered' ? this.filterData : this.allData;
    const allSelected = data.every((item: any) => item.selected);
    data.forEach((item: any) => (
      item.selected = !allSelected
    ));
  }

  public isAllSelected(): boolean {
    return this.allData.every(item => item.selected);
  }
  
  public popup(pop: string) {
    switch (pop) {
      case 'warning':
        this.warning_pop = true;
        break;
      case 'payment':
        this.payment_pop = true;
        break;
      case 'success':
        this.success_pop = true;
        break;
      case 'fail':
        this.fail_pop = true;
        break;
      case 'search':
        this.warning_search = true;
        break;
    }
  }

  public handleConfirm(pop: string) {
    switch (pop) {
      case 'warning':
        this.warning_pop = false;
        break;
      case 'payment':
        this.payment_pop = false;
        break;
      case 'success':
        this.success_pop = false;
        break;
      case 'fail':
        this.fail_pop = false;
        break;
      case '                                                                                                                                            search':
        this.warning_search= false;
        break;
    }
  }
  
  public setLoading(isLoading: boolean): void {
    this.loadingApp.emit(isLoading);
  }
  
}

