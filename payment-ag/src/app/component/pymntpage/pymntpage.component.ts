import { Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PopupComponent } from "../shared/popup/popup.component";
import { CommonModule } from '@angular/common';
import { FindCusCode, GetInv, InvoiceData, SearchInv } from '../../interface/payment-interface';
import { ApiService } from '../../service/api.service';
import { firstValueFrom } from 'rxjs';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-pymntpage',
  imports: [
    MatIconModule
    , PopupComponent
    , CommonModule
    , FormsModule
    , ReactiveFormsModule
    , LoadingSpinnerComponent
  ],
  templateUrl: './pymntpage.component.html',
  styleUrl: './pymntpage.component.css'
})
export class PymntpageComponent {
  public paymentForm!: FormGroup;
  public filterData: any[] = [];
  public allData: InvoiceData[] = []; 
  public customerLabel: string = '';
  public warning_pop: boolean = false;
  public payment_pop: boolean = false;
  public success_pop: boolean = false;
  public fail_pop: boolean = false;
  public warning_search: boolean = false;
  public isLoading = false;
  public isVisible: any;  
  public headerForm!: FormGroup;
  public searchData = {} as SearchInv;
  public findCus = {} as FindCusCode;
  public getInv = {} as GetInv;
  public username: any;  
  public customercode: any;  
  public customername: any;  
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
    const accountUserName = localStorage.getItem('username');
    if (accountUserName) {
      this.username = accountUserName;
    } else {
      this.username = '';
    }
    this.findCusCode();
  }

  private populateForm(): void {
    this.searchData.customer_code = this.headerForm.controls['cuscode'].value;
    this.searchData.invno = this.headerForm.controls['invNo'].value;
  }


  public loadData(): void {
   // 
  }

  public async findCusCode(): Promise<void> {
    this.setLoading(true);
    this.findCus.username = this.username;
    await this.api.findCusCode(this.findCus).subscribe(async (result: any) => {
      this.getInv.usrcuscode = result.cuscode;
      this.customercode = result.cuscode;
      this.customername = result.cusname;
      console.log( 'cuscode',this.customercode);
      if (this.getInv.usrcuscode) {
        await this.api.getDataInvoice(this.getInv).subscribe((res: any) => {
          console.log(res);
          this.allData = res.data.map((invoice: any) => ({
            docType: invoice.pywdoctype
            , docNo: invoice.pywdocno
            , docDate: this.formatDate(invoice.pywdocdate, '/')
            , dueDate: this.formatDate(invoice.pywduedate, '/')
            , docAmt: this.formatAmount(invoice.pywdocamt)
            , balAmt: this.formatAmount(invoice.pywbalamt)
            , stat: this.statusInv(invoice.pywstat)
          }));
          this.setLoading(false);
        }, (error: any) => {
          console.log('Error during login:', error);
          this.setLoading(false);
        });
      } else {
        this.allData = [];
        this.setLoading(false);
      }
    }, (error: any) => {
      console.log('Error during login:', error);
      this.setLoading(false);
    });
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

      // console.log('alert message');


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
    this.setLoading(false);
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
    return this.allData.length > 0 && this.allData.every(item => item.selected);
  }
  
  
  public popup(pop: string): void {
    const key = `${pop}_pop` as keyof this;
    if (typeof this[key] === 'boolean') {
      (this[key] as boolean) = true;
    }
  }
  
  public handleConfirm(pop: string): void {
    const key = `${pop}_pop` as keyof this;
    if (typeof this[key] === 'boolean') {
      (this[key] as boolean) = false;
    }
  }
  
  public formatDate(date: string | number | Date, separator: '-' | '/'): string {
    if (date instanceof Date) {
        let day = String(date.getDate()).padStart(2, '0');
        let month = String(date.getMonth() + 1).padStart(2, '0');
        let year = date.getFullYear();
        return `${day}${separator}${month}${separator}${year}`;
    }

    if (typeof date === 'number') {
        date = date.toString(); 
    }

    if (typeof date === 'string' && date.length === 8) {
        let day = date.slice(0, 2);
        let month = date.slice(2, 4);
        let year = date.slice(4, 8); 
        return `${day}${separator}${month}${separator}${year}`;
    }

    return ''; 
  }

  public formatAmount (amount: string | number): string  {
    return Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  public statusInv (stat: string ): string  {
    let statinv = ''
    if (stat === 'N') {
      statinv = 'Not yet paid';
    } else if (stat === 'P') {
      statinv = 'Process';
    }
    return statinv
  };
  
  public setLoading(isLoading: boolean) {
    console.log('Loading status:', isLoading); // Debug
    this.isLoading = isLoading;
  }
  
}
