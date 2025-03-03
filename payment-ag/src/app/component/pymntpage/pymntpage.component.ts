import { Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PopupComponent } from "../shared/popup/popup.component";
import { CommonModule } from '@angular/common';
import { FindCusCode, GetInv, InvoiceData, SearchInv } from '../../interface/payment-interface';
import { ApiService } from '../../service/api.service';
import { firstValueFrom } from 'rxjs';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { Router ,RouterLink } from '@angular/router';

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
  public dataDisplay: InvoiceData[] = [];
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
  public paymentData = {} as SearchInv;
  public findCus = {} as FindCusCode;
  public getInv = {} as GetInv;
  public username: any;
  public customercode: any;
  public customername: any;
  public loadingApp: EventEmitter<boolean> = new EventEmitter(false);

  constructor(
    private formBuilder: FormBuilder
    , private api: ApiService
    , private router: Router
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

  public async findCusCode(): Promise<void> {
    this.setLoading(true);
    this.findCus.username = this.username;
    await this.api.findCusCode(this.findCus).subscribe(async (result: any) => {
      this.getInv.usrcuscode = result.cuscode;
      this.customercode = result.cuscode;
      this.customername = result.cusname;
      console.log('cuscode', this.customercode);
      if (this.getInv.usrcuscode) {
        await this.api.getDataInvoice(this.getInv).subscribe((res: any) => {
          console.log(res);
          this.allData = res.data.map((invoice: any) => ({
            selected: this.convertFlag(invoice.pywflag)
            , docType: invoice.pywdoctype
            , docNo: invoice.pywdocno
            , docDate: this.formatDate(invoice.pywdocdate, '/')
            , dueDate: this.formatDate(invoice.pywduedate, '/')
            , docAmt: this.formatAmount(invoice.pywdocamt)
            , balAmt: this.formatAmount(invoice.pywbalamt)
            , stat: this.statusInv(invoice.pywstat)
          }));
          this.dataDisplay = this.allData;
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
    this.populateForm();
    if (this.searchData.invno) {
      this.dataDisplay = this.allData.filter((item: InvoiceData) =>
        item.docNo === this.searchData.invno
      );
    } else {
      this.dataDisplay = this.allData;
    }
    this.setLoading(false);
  }

  public createPayment(): void {
    const data = {
        username: this.username
      , cuscode: this.customercode
    }
    this.api.getPayment(data).subscribe((response: any) => {
      console.log(response);
      this.paymentData = response.data.map((payment: any) => ({
        merchantId: ''
        , amount:  payment.amount
        , orderRef:  payment.paymentno
        , currCode: ''
        , successUrl:  ''
        , failUrl: ''
        , cancelUrl: ''
        , payType: ''
        , lang: 'E'
        , TxType: ''
        , Term: ''
        , promotionType:  ''
        , supplierId:  ''
        , productId:  ''
        , serialNo:  ''
        , model:  ''
        , itemTotal:  ''
        , redeemPoint:  ''
        , paymentSkip:  ''
        , memberPay_service: ''
        , memberPay_memberId: ''
        , secureHash: ''
      }));
      this.router.navigate(['/payment-redirect'], { queryParams: this.paymentData });
      this.setLoading(false);
      this.popup(response.status);
    }, (error: any) => {
        console.error('Error updating user:', error);
      }
    );
  }

  public checkFlag(record: InvoiceData): void {
    this.setLoading(true);
    console.log(record);
    const data = {
      selected: record.selected,  // Assuming this is your unique key to identify the record
      cuscode: this.customercode,
      docno: record.docNo
    }
    this.api.updateflag(data).subscribe((response: any) => {
      console.log(response);
      this.allData = response.data.map((invoice: any) => ({
        selected: this.convertFlag(invoice.pywflag)
        , docType: invoice.pywdoctype
        , docNo: invoice.pywdocno
        , docDate: this.formatDate(invoice.pywdocdate, '/')
        , dueDate: this.formatDate(invoice.pywduedate, '/')
        , docAmt: this.formatAmount(invoice.pywdocamt)
        , balAmt: this.formatAmount(invoice.pywbalamt)
        , stat: this.statusInv(invoice.pywstat)
      }));
      this.dataDisplay = this.allData;
      this.setLoading(false);
    }, (error: any) => {
      console.log('Error during login:', error);
      this.setLoading(false);
    });
  }

  public toggleSelectAll(table: string): void {
    this.setLoading(true);
    const data = this.allData;
    const allSelected = data.every((item: any) => item.stat === 'Process' || item.selected);
    data.forEach((item: any) => {
      if (item.stat !== 'Process') {
        item.selected = !allSelected;
      }
    });
    this.updateFlagAll(!allSelected);
  }

  public updateFlagAll(flag: boolean): void {
    let flagAll = flag ? '1' : '0';
    const data = {
      cuscode: this.customercode
      , flag: flagAll
    }
    this.api.updateAllflag(data).subscribe((response: any) => {
      console.log(response);
      this.allData = response.data.map((invoice: any) => ({
        selected: this.convertFlag(invoice.pywflag)
        , docType: invoice.pywdoctype
        , docNo: invoice.pywdocno
        , docDate: this.formatDate(invoice.pywdocdate, '/')
        , dueDate: this.formatDate(invoice.pywduedate, '/')
        , docAmt: this.formatAmount(invoice.pywdocamt)
        , balAmt: this.formatAmount(invoice.pywbalamt)
        , stat: this.statusInv(invoice.pywstat)
      }));
      this.dataDisplay = this.allData;
      this.setLoading(false);
    }, (error: any) => {
      console.log('Error during login:', error);
      this.setLoading(false);
    });
  }

  public isAllSelected(): boolean {
    return (
      this.allData.length > 0 &&
      this.allData
        .filter(item => item.stat !== 'Process')
        .every(item => item.selected)
    );
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

  public formatAmount(amount: string | number): string {
    return Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  public convertFlag(flag: string | null): boolean {
    let flagRe = false
    if (flag === '0' || !flag) {
      flagRe = false
    } else if (flag === '1') {
      flagRe = true;
    }
    return flagRe
  };


  public statusInv(stat: string): string {
    let statinv = ''
    if (stat === 'N') {
      statinv = 'Unpaid';
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
