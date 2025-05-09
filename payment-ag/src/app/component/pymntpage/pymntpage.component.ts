import { Component, EventEmitter, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PopupComponent } from "../shared/popup/popup.component";
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FindCusCode, GetInv, InvoiceData, SearchInv } from '../../interface/payment-interface';
import { ApiService } from '../../service/api.service';
import { firstValueFrom } from 'rxjs';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { Router ,RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { PagingComponent } from '../shared/paging/paging.component';
import { AuthService } from '../../auth.service';
import { BankPopupComponent } from '../shared/bank-popup/bank-popup.component';
import { DummyPopupComponent } from '../shared/dummy-popup/dummy-popup.component';
import { CreatSo } from '../../interface/dummy-interface';
import { LinkPopupComponent } from '../shared/link-popup/link-popup.component';

@Component({
  selector: 'app-pymntpage',
  imports: [
    MatIconModule
    , PopupComponent
    , CommonModule
    , FormsModule
    , ReactiveFormsModule
    , LoadingSpinnerComponent
    , MatTableModule
    , MatPaginatorModule
    , MatSortModule
    , PagingComponent
    , BankPopupComponent
    , DummyPopupComponent
    , LinkPopupComponent
  ],
  templateUrl: './pymntpage.component.html',
  styleUrl: './pymntpage.component.css'
})
export class PymntpageComponent {
  public paymentForm!: FormGroup;
  public filterData: any[] = [];
  public message_list: any[] = [];
  public dataDisplay: InvoiceData[] = [];
  public allData: InvoiceData[] = [];
  public customerLabel: string = '';
  public warning_pop: boolean = false;
  public payment_pop: boolean = false;
  public input_pop: boolean = false;
  public cn_pop: boolean = false;
  public less_zero_pop: boolean = false;
  public success_pop: boolean = false;
  public link_pop: boolean = false;
  public bal_pop: boolean = false;
  public fail_pop: boolean = false;
  public not_found_pop: boolean = false;
  public warning_search: boolean = false;
  public bank_pop: boolean = false;
  public dummy_pop: boolean = false;
  public isLoading = false;
  public isVisible: any;
  public headerForm!: FormGroup;
  public searchData = {} as SearchInv;
  public paymentData = {} as SearchInv;
  public createSoData = {} as CreatSo;
  public findCus = {} as FindCusCode;
  public getInv = {} as GetInv;
  public username: any;
  public customercode: any;
  public customername: any;
  public linkMessage: any;
  public paymentNo: any;
  public loadingApp: EventEmitter<boolean> = new EventEmitter(false);
  public isMobile: boolean = false; 
  private isBrowser: boolean; 
  public page_start: number = 1;
  public page_limit: number = 10;
  public totalRecords: number = 0;
  public pageSizeOptions: number[] = [ 10, 20, 50, 100];
  public balanceAmount: number = 0.00;
  public serviceCharge: number = 0.00;
  public totalAmount: number = 0.00;

  public displayedColumns: string[] = ['selected', 'docType', 'docNo', 'docDate', 'dueDate', 'docAmt', 'balAmt', 'paidamt', 'stat', 'note'];
  public dataSource = new MatTableDataSource<any>([]);

  constructor(
    private formBuilder: FormBuilder
    , private api: ApiService
    , private router: Router
    , private authService: AuthService
    , @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.headerForm = this.formBuilder.group({
      cusCode: [{ value: null, disabled: false }]
      , invNo: [{ value: null, disabled: false }]
    });
  }

  @HostListener('window:mousemove', ['$event'])
  public onMouseMove(event: MouseEvent) {
    this.authService.resetOnUserActivity();
  }

  @HostListener('window:keydown', ['$event'])
  public onKeyDown(event: KeyboardEvent) {
    this.authService.resetOnUserActivity();
  }

  public ngOnInit(): void {
    const accountUserName = localStorage.getItem('username');
    if (accountUserName) {
      this.username = accountUserName;
      this.authService.resetOnUserActivity();
    } else {
      this.username = '';
    }
    this.findCusCode();
    if (this.isBrowser) {
      this.checkScreenSize();
      this.authService.resetOnUserActivity();
    }
  }

  @HostListener('window:resize', ['$event'])
    public onResize(event: any) {
      if (this.isBrowser) {
        this.checkScreenSize();
      }
    }
    
    public checkScreenSize() {
      if (this.isBrowser) {
        this.isMobile = window.innerWidth <= 768;
      }
    }
    
  private populateForm(): void {
    this.searchData.cuscode = this.headerForm.controls['cusCode'].value;
    this.searchData.invno = this.headerForm.controls['invNo'].value;
  }

  public async findCusCode(): Promise<void> {
    this.setLoading(true);
    // this.findCus.username = this.username;
    // await this.api.findCusCode(this.findCus).subscribe(async (result: any) => {
      //   this.customercode = result.cuscode;
      //   this.customername = result.cusname;
      //   console.log('cuscode', this.customercode);
      this.getInv.usrcuscode = this.searchData.cuscode;
      if (this.getInv.usrcuscode) {
        await this.api.getDataInvoice(this.getInv).subscribe((res: any) => {
          console.log(res);
          if(res.status ==='success'){
            this.loadData()
          }
        }, (error: any) => {
          console.log('Error during login:', error);
          this.setLoading(false);
        });
      } else {
        this.allData = [];
        this.setLoading(false);
      }
    // }, (error: any) => {
    //   console.log('Error during login:', error);
    //   this.setLoading(false);
    // });
  }

  public loadData (): void {
    this.setLoading(true);
    const data = {
      usrcuscode: this.searchData.cuscode
      , docNo: this.searchData.invno || ''
      , page_start: this.page_start 
      , page_limit: this.page_limit
    }
     this.api.loadData(data).subscribe((res: any) => {
      console.log(res);
      if (res.total > 0 ) {
        this.allData = res.data.map((invoice: any) => ({
          selected: this.convertFlag(invoice.pywflag)
          , docType: invoice.pywdoctype
          , docNo: invoice.pywdocno
          , docDate: this.formatDate(invoice.pywdocdate, '/')
          , dueDate: this.formatDate(invoice.pywduedate, '/')
          , docAmt: this.formatAmount(invoice.pywdocamt)
          , balAmt: this.formatAmount(invoice.pywbalamt)
          , paidamt: this.formatNumberWithCommas(parseFloat(invoice.pywpaidamt).toFixed(2))
          , refdoc: invoice.pywrefdoc
          , stat: this.statusInv(invoice.pywstat)
          , note: invoice.pywnote
        }));
        this.dataDisplay = this.allData;
        this.dataSource.data = this.dataDisplay; 
        this.totalRecords = res.total;
        this.setLoading(false);
      } else {
        this.popup('not_found')
        this.setLoading(false);
      }
    }, (error: any) => {
      console.log('Error during login:', error);
      this.setLoading(false);
    });

  }

  public onPageChanged(event: { pageStart: number, pageLimit: number }) {
    this.setLoading(true);
    this.page_start = event.pageStart;
    this.page_limit = event.pageLimit;
    this.loadData();
  }

  public async searchPayment(): Promise<void> {
    this.setLoading(true);
    this.populateForm();
    if(this.searchData.cuscode && !this.searchData.invno) {
      this.findCusCode();
    } else if (!this.searchData.cuscode && !this.searchData.invno){
      this.popup('input')
      this.setLoading(false);
    } 
    else if (!this.searchData.cuscode && this.searchData.invno){
      this.popup('input')
      this.setLoading(false);
    } else if (this.searchData.cuscode && this.searchData.invno && this.dataDisplay.length === 0) {
      this.findCusCode();
      this.setLoading(false);
    } else {
      this.dataDisplay = this.allData.filter((item: InvoiceData) =>
        item.docNo === this.searchData.invno
      );
      this.dataSource.data = this.dataDisplay;
      this.setLoading(false);
    }
  }

  
  public closeBankPopup(): void {
    this.bank_pop = false; 
  }
  
  public closeDummyPopup(): void {
    this.dummy_pop = false; 
  }
  
  public createPayment(): void {  
    this.setLoading(true);
    const data = {
      cuscode: this.searchData.cuscode
    }
    if (this.searchData.cuscode){
      this.api.findSumamt(data).subscribe((res: any) => {
        console.log(res);
        if(res.isSelect > 0){
          this.balanceAmount =  Number(Number(res.sumamt).toFixed(2));
          this.api.missingCn(data).subscribe((result: any) => {
            if (result.data.length > 0) {
                console.log(result);
                this.message_list = result.data.map((cn: any) => ({
                  cnNo: cn.cnNo
                  , refCnNo:  cn.refCNNo
                }));
                this.popup('cn'); 
                this.setLoading(false);
            } else {
              if (this.balanceAmount > 0) {
                this.popup('bank');
                this.setLoading(false);
              } else {
                this.popup('less_zero');
                this.setLoading(false);
              }
            }
          }, (error: any) => {
            console.log('Error during login:', error);
            this.setLoading(false);
          });

        } else {
          this.popup('warning');
          this.setLoading(false);
        }
      }, (error: any) => {
        console.log('Error during login:', error);
        this.setLoading(false);
      });
    } else {
      this.popup('warning');
      this.setLoading(false);
    }
  }


  public createDummy(): void {  
    this.setLoading(true);
    if (!this.searchData.cuscode){
      this.setLoading(false);
      this.popup('input');
    } else {
      this.popup('dummy');
      this.setLoading(false);
    }
  }

  public confirmDummy(event: CreatSo): void {  
    this.setLoading(true);
    this.createSoData.cuscode = this.searchData.cuscode
    this.createSoData.docType = event.docType
    this.createSoData.docNo = event.docNo
    this.createSoData.docAmt = event.docAmt
    this.createSoData.usage = event.usage
    this.createSoData.note = event.note
    this.api.createSo(this.createSoData).subscribe((response: any) => {
      this.closeDummyPopup();
      this.loadData();
      this.popup(response.status);
      this.setLoading(false);
    }, (error: any) => {
        console.error('Error updating user:', error);
        this.setLoading(false);
      }
    );
  }


  public confirmPayment(event: { totalAmount: number; serviceCharge: number; card: string; bank:string; }): void{
    this.setLoading(true);
    const { totalAmount, serviceCharge, card, bank } = event; 
    const data = {
      username: this.username
      , cuscode: this.searchData.cuscode
      , sumamt: this.balanceAmount.toString()
      , fee: serviceCharge.toString()
      , totalAmt: totalAmount.toString()
      , bank: bank
      , card: card
    }
    this.api.getPayment(data).subscribe((response: any) => {
      console.log(response);
      if(response.status === 'success'){
        this.loadData();
        this.paymentNo = response.paymentNo;
        this.linkMessage = 'https://webapp.sisthai.com/payment/ktc/callBank/'+ response.paymentNo +'/'+ response.link;
        this.popup('link');
        this.setLoading(false);
      } else {
        this.popup(response.status);
        this.setLoading(false);
      }
    }, (error: any) => {
        console.error('Error updating user:', error);
      }
    );
    this.bank_pop = false; 
  }

  public checkFlag(record: InvoiceData): void {
    this.setLoading(true);
    console.log(record);
    const data = {
      selected: record.selected,  // Assuming this is your unique key to identify the record
      cuscode: this.searchData.cuscode,
      docno: record.docNo
    }
    this.api.updateflag(data).subscribe((response: any) => {
      console.log(response);
      if(response.status ==='success'){
        this.loadData()
      }
    }, (error: any) => {
      console.log('Error during login:', error);
      this.setLoading(false);
    });
  }

  public toggleSelectAll(table: string): void {
    this.setLoading(true);
    const data = this.allData;
    const allSelected = data.every((item: any) => item.stat === 'Process' || item.stat === 'Success' || item.selected);
    data.forEach((item: any) => {
      if (item.stat !== 'Process' && item.stat !== 'Success') {
        item.selected = !allSelected;
      }
    });
    this.updateFlagAll(!allSelected);
  }

  public updateFlagAll(flag: boolean): void {
    this.setLoading(true);
    let flagAll = flag ? '1' : '0';
    const data = {
      cuscode: this.searchData.cuscode
      , flag: flagAll
    }
    this.api.updateAllflag(data).subscribe((response: any) => {
      console.log(response);
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


  public updatePaidAmt(record: any): void {
    this.setLoading(true);
    if (record.paidamt !== null && record.paidamt !== undefined) {
      let value = record.paidamt.toString().replace(/,/g, ''); 
  
      const numericValue = parseFloat(value);
      
      if (!isNaN(numericValue)) {
        record.paidamt = this.formatNumberWithCommas(numericValue.toFixed(2));
  
        setTimeout(() => {
          const inputField = document.querySelector(`[data-id="${record.id}"]`) as HTMLInputElement;
          if (inputField) inputField.value = this.formatNumberWithCommas(numericValue.toFixed(2));
        });
        console.log('Updated paidamt:', record.paidamt);
      }
    }
    const data = {
      cuscode: this.searchData.cuscode,
      docno: record.docNo,
      paidamt : record.paidamt.toString().replace(/,/g, '')
    }
    if (data.paidamt > record.balAmt && record.docType !== 'SO') {
      this.popup('bal');
      record.paidamt = record.balAmt; // Reset to max allowed value
      if (record.paidamt !== null && record.paidamt !== undefined) {
        let value = record.paidamt.toString().replace(/,/g, ''); 
    
        const numericValue = parseFloat(value);
        
        if (!isNaN(numericValue)) {
          record.paidamt = this.formatNumberWithCommas(numericValue.toFixed(2));
    
          setTimeout(() => {
            const inputField = document.querySelector(`[data-id="${record.id}"]`) as HTMLInputElement;
            if (inputField) inputField.value = this.formatNumberWithCommas(numericValue.toFixed(2));
          });
          console.log('Updated paidamt:', record.paidamt);
        }
      }
      this.setLoading(false);
    } else {
      this.api.updatePaidAmt(data).subscribe((response: any) => {
        console.log(response);
        this.setLoading(false);
      }, (error: any) => {
        console.log('Error during login:', error);
        this.setLoading(false);
      });
    }
    
  }

  public allowOnlyNumbers(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight'];
    const inputChar = event.key;
  
    const isNumber = /^[0-9.]$/.test(inputChar);
    const inputElement = event.target as HTMLInputElement;
  
    // Prevent more than one decimal point
    if (inputChar === '.' && inputElement.value.includes('.')) {
      event.preventDefault();
      return;
    }
  
    if (!isNumber && !allowedKeys.includes(inputChar)) {
      event.preventDefault();
    }
  }

  private formatNumberWithCommas(amount: string): string {
    return amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  

  public validateNumberInput(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (!/[0-9.]/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
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

  public formatAmount(amount: string | number): number {
    const parsedAmount = typeof amount === 'string' ? +amount : amount; // Convert to number
    return isNaN(parsedAmount) ? 0 : parsedAmount; // Return 0 if invalid number
  }
  

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
    } else if (stat === 'S') {
      statinv = 'Success';
    }
    return statinv
  };

  public setLoading(isLoading: boolean) {
    console.log('Loading status:', isLoading); // Debug
    this.isLoading = isLoading;
  }
  

}
