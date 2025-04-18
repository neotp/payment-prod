import { Component, ElementRef, EventEmitter, HostListener, Inject, PLATFORM_ID, ViewChild  } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PopupComponent } from "../../shared/popup/popup.component";
import { CommonModule, isPlatformBrowser, DecimalPipe  } from '@angular/common';
import { ApiService } from '../../../service/api.service';
import { AgGridModule } from 'ag-grid-angular';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { PagingComponent } from '../../shared/paging/paging.component';
import { AuthService } from '../../../auth.service'; 
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SearchPayment } from '../../../interface/history-interface';
import { ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-hispage001a',
  imports: [
    MatIconModule,
    PopupComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    LoadingSpinnerComponent,
    MatTableModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatSortModule,
    PagingComponent
],
  templateUrl: './hispage001a.component.html',
  styleUrl: './hispage001a.component.css',
  providers: [DecimalPipe] 
})
export class Hispage001aComponent {
@ViewChild('table', { static: true }) table!: ElementRef;
  public resizing: boolean = false;
  public currentColumn: HTMLElement | null = null;
  public startX!: number;
  public startWidth!: number;
  public paymentForm!: FormGroup;
  public filterData: any[] = [];
  public allData: any[] = []; 
  public customerLabel: string = '';
  public warning_pop: boolean = false;
  public payment_pop: boolean = false;
  public savesucess_pop: boolean = false;
  public fail_pop: boolean = false;
  public warning_search: boolean = false;
  public isVisible: any;  
  public username: any;  
  public searchData = {} as SearchPayment;
  public loadingApp: EventEmitter<boolean> = new EventEmitter(false);
  public headerForm!: FormGroup;
  public isLoading = false;
  public isMobile: boolean = false; 
  public page_start: number = 1;
  public page_limit: number = 10;
  public totalRecords: number = 0;
  public headerData: any = {} ;
  public statData: any = {} ;
  public pageSizeOptions: number[] = [ 10, 20, 50, 100];

  public displayedColumns: string[] = ['payNo', 'cuscode', 'amt', 'feeAmt', 'totolAmt', 'bank', 'card', 'credate', 'creusr', 'link', 'stat'];
  public dataSource = new MatTableDataSource<any>([]);
  private isBrowser: boolean; 

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;;
  constructor(
    private router: Router
    , private formBuilder: FormBuilder
    , private api: ApiService
    , private authService: AuthService
    , private route: ActivatedRoute
    , @Inject(PLATFORM_ID) private platformId: Object
    , private decimalPipe: DecimalPipe
  ) {
      this.isBrowser = isPlatformBrowser(this.platformId);
      this.headerForm = this.formBuilder.group({
        cuscode: [{ value: null, disabled: false }]
        , payNo: [{ value: null, disabled: false }]
        , bank: [{ value: 'all', disabled: false }]
        , card: [{ value: 'all', disabled: false }]
        , creusr: [{ value: null, disabled: false }]
        , credateFrom: [{ value: new Date().toISOString().split('T')[0], disabled: false }]
        , credateTo: [{ value: new Date().toISOString().split('T')[0], disabled: false }]
        , status: [{ value: 'all', disabled: false }]
      });
      const navigation = this.router.getCurrentNavigation();
      if (navigation?.extras?.state) {
        this.statData = navigation.extras.state['statData'];
      };
    }

  public ngOnInit(): void {
    this.setLoading(true);
    if (this.isBrowser) {
      this.checkScreenSize();
    }
    const accountRole = localStorage.getItem('accountRole');
    const accountUserName = localStorage.getItem('username');

    if (!accountRole) {
      this.allData = [];
      this.setLoading(false);
      return; 
    }
    if (accountUserName) {
      this.username = accountUserName;
    } else {
      this.username = '';
    }
    this.resetForm();
    if (this.statData && Object.keys(this.statData).length > 0) {
      this.refreshForm(this.statData);
      this.searchPayment();
    } else {
      this.setLoading(false);
    }
    this.authService.resetOnUserActivity();
  }

  public navigateToPage(record: any): void {
    this.setLoading(true);
    this.headerData.hdrid = record.hdrId;
    this.headerData.payNo = record.payNo;
    this.headerData.cuscode = record.cuscode;
    this.headerData.amt = this.formatAmountDeciaml(this.formatAmount(record.amt));
    this.headerData.feeAmt = this.formatAmountDeciaml(this.formatAmount(record.feeAmt));
    this.headerData.totalAmt = this.formatAmountDeciaml(this.formatAmount(record.totalAmt));
    this.headerData.bank = record.bank;
    this.headerData.card = record.card;
    this.headerData.credate = record.credate;
    this.headerData.creusr = record.creusr;
    this.headerData.stat = record.stat;

    this.searchData.status = this.searchData.status === '' ? 'all' : this.searchData.status;
    this.searchData.bank = this.searchData.bank === '' ? 'all' : this.searchData.bank;
    this.searchData.card = this.searchData.card === '' ? 'all' : this.searchData.card;
  
    this.router.navigate(['web-payment/history-detail'], {
      state: {
        headerData: this.headerData
        , searchData: this.searchData
      }
      , queryParamsHandling: 'preserve'
    });
  }

  public ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
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

  public refreshForm(data: any): void {
    console.log('data',data);
    this.headerForm.controls['cuscode'].setValue(data.cuscode);
    this.headerForm.controls['payNo'].setValue(data.payNo);
    this.headerForm.controls['bank'].setValue(data.bank);
    this.headerForm.controls['card'].setValue(data.card);
    this.headerForm.controls['creusr'].setValue(data.creusr);
    this.headerForm.controls['credateFrom'].setValue(data.credateFrom);
    this.headerForm.controls['credateTo'].setValue(data.credateTo);
    this.headerForm.controls['status'].setValue(data.status);
  }
  public resetForm(): void {
    this.headerForm.controls['cuscode'].reset;
    this.headerForm.controls['payNo'].reset;
    this.headerForm.controls['bank'].reset;
    this.headerForm.controls['card'].reset;
    this.headerForm.controls['creusr'].reset;
    this.headerForm.controls['credateFrom'].reset;
    this.headerForm.controls['credateTo'].reset;
    this.headerForm.controls['status'].reset;
  }

  private populateForm(): void {
    this.searchData.cuscode = this.headerForm.controls['cuscode'].value || '';
    this.searchData.payNo = this.headerForm.controls['payNo'].value || '';
    this.searchData.bank = (this.headerForm.controls['bank'].value === 'all'? '' : this.headerForm.controls['bank'].value) || '';
    this.searchData.card = (this.headerForm.controls['card'].value === 'all'? '' : this.headerForm.controls['card'].value) || '';
    this.searchData.creusr = this.headerForm.controls['creusr'].value || '';
    this.searchData.credateFrom = this.headerForm.controls['credateFrom'].value || '';
    this.searchData.credateTo = this.headerForm.controls['credateTo'].value || '';
    this.searchData.status = (this.headerForm.controls['status'].value === 'all'? '' : this.headerForm.controls['status'].value) || '';
  }

  public async searchPayment(): Promise<void> {
     this.setLoading(true);
     this.populateForm();
     this.searchData.page_start = this.page_start
     this.searchData.page_limit = this.page_limit
     this.api.searchPaymentData(this.searchData).subscribe((result: any) => {
       this.allData = result.data.map((invoice: any) => ({
         hdrId: invoice.hdrId
         , payNo: invoice.payNo
         , cuscode: invoice.cuscode
         , amt: this.formatAmount(invoice.amt)
         , feeAmt: this.formatAmount(invoice.feeAmt)
         , totalAmt: this.formatAmount(invoice.totalAmt)
         , bank: this.cardAndBank(invoice.bank)
         , card: this.cardAndBank(invoice.card)
         , credate: this.formatDate(invoice.credate, '/')
         , creusr: invoice.creusr
         , link: 'https://webapp.sisthai.com/payment/ktc/callBank/'+ invoice.payNo +'/'+ invoice.link
         , stat: this.statusPayment(invoice.stat)
       }));
       this.dataSource.data = this.allData;
       this.totalRecords = result.total;
       this.setLoading(false);
     }, (error: any) => {
         console.error('Error updating user:', error);
         this.setLoading(false);
     });
   }

  public copyLink(record: any): void {
    navigator.clipboard.writeText(record.link).then(
      () => {
        alert('Link Copied Now');
        console.log(record.link);
        
      },
      (err) => {
        console.error('Failed to copy: ', err);
      }
    ); 
  }

  public onPageChanged(event: { pageStart: number, pageLimit: number }) {
    this.page_start = event.pageStart;
    this.page_limit = event.pageLimit;
    this.searchPayment();
  }
  public updateDataNow(): void {
    this.setLoading(true);
    this.api.updateDataNow().subscribe((response: any) => {
      this.popup(response.status);
    }, (error: any) => {
        console.error('Error updating user:', error);
      }
    );
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

  public formatAmountDeciaml(amount: number): string  {
    return this.decimalPipe.transform(amount, '1.2-2') || '';  // Formats to 1 or 2 decimal places
  }
  

  
 // This will handle mousemove event when resizing
  @HostListener('document:mousemove', ['$event'])
  onMouseMove = (event: MouseEvent): void => {
    if (this.resizing && this.currentColumn) {
      this.authService.resetOnUserActivity();
      const deltaX = event.clientX - this.startX;
      this.currentColumn.style.width = `${this.startWidth + deltaX}px`;
    }
  };

  // This will handle the mouseup event to stop resizing
  @HostListener('document:mouseup', [])
  onMouseUp = (): void => {
    this.authService.resetOnUserActivity();
    this.resizing = false;
    this.currentColumn = null;
    document.removeEventListener('mousemove', this.onMouseMove as EventListener);
    document.removeEventListener('mouseup', this.onMouseUp as EventListener);
  };

   // Method to start resizing
   startResizing(event: MouseEvent): void {
    const column = event.target as HTMLElement;
    if (column && column.classList.contains('resize-handle')) {
      this.resizing = true;
      this.currentColumn = column;
      this.startX = event.clientX;
      this.startWidth = column.offsetWidth;

      // Bind the events with correct type signatures
      document.addEventListener('mousemove', this.onMouseMove as EventListener);
      document.addEventListener('mouseup', this.onMouseUp as EventListener);
    }
  }

  public statusPayment(stat: string): string {
    let statinv = ''
    if (stat === 'Y') {
      statinv = 'Success';
    } else if (stat === 'P') {
      statinv = 'Process';
    } else if (stat === 'E') {
      statinv = 'Expire';
    } else if (stat === 'C') {
      statinv = 'Cancel';
    } else if (stat === 'F') {
      statinv = 'Failed';
    }
    return statinv
  };
  
  public cardAndBank(val: string): string {
    let value = ''
    if (val === 'ktc') {
      value = 'KTC';
    } else if (val === 'ktb') {
      value = 'KTB';
    } else if (val === 'kbank') {
      value = 'K-Bank';
    } else if (val === 'visa') {
      value = 'VISA';
    } else if (val === 'master') {
      value = 'MasterCard';
    } else if (val === 'other') {
      value = 'JBC/UPI';
    }
    return value
  };
  
  
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
  

  public getBackgroundColor(status: string): string {
    switch (status) {
      case 'A': // Approve
        return '#b8faec';
      case 'R': // Reject
        return '#fd9a9a';
      default: // Pending (P)
        return '#e4e4e4';
    }
  }

  public getTextColor(status: string): string {
    switch (status) {
      case 'A': // Approve
        return '#00317A'; // Text color for approve
      case 'R': // Reject
        return '#00317A'; // Text color for reject
      default: // Pending (P)
        return ' #00317A'; // Text color for pending
    }
  }

  public setLoading(isLoading: boolean) {
    console.log('Loading status:', isLoading); // Debug
    this.isLoading = isLoading;
  }
  
}

