import { Component, ElementRef, EventEmitter, HostListener, Inject, PLATFORM_ID, ViewChild  } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PopupComponent } from "../../shared/popup/popup.component";
import { CommonModule, isPlatformBrowser, formatDate  } from '@angular/common';
import { SearchInv } from '../../../interface/payment-interface';
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
import { SearchPayment, SearchPaymentDetail } from '../../../interface/history-interface';
import { Router, RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hispage001b',
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
  templateUrl: './hispage001b.component.html',
  styleUrl: './hispage001b.component.css'
})
export class Hispage001bComponent {
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
  public findDataDetail = {} as SearchPaymentDetail;
  public loadingApp: EventEmitter<boolean> = new EventEmitter(false);
  public headerForm!: FormGroup;
  public isLoading = false;
  public isMobile: boolean = false; 
  public page_start: number = 1;
  public page_limit: number = 10;
  public totalRecords: number = 0;
  public pageSizeOptions: number[] = [ 10, 20, 50, 100];
  public headerData: any
  public statData: any

  public displayedColumns: string[] = ['docType', 'docNo', 'docDate', 'dueDate', 'docAmt', 'balAmt', 'paidAmt', 'refDoc', 'term', 'stat', 'note'];
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
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.headerForm = this.formBuilder.group({
       hdrid: [{ value: null, disabled: true }]
      , payNo: [{ value: null, disabled: true }]
      , cuscode: [{ value: null, disabled: true }]
      , creusr: [{ value: null, disabled: true }]
      , credate: [{ value: null, disabled: true }]
      , bank: [{ value: null, disabled: true }]
      , card: [{ value: null, disabled: true }]
      , amt: [{ value: null, disabled: true }]
      , feeAmt: [{ value: null, disabled: true }]
      , totalAmt: [{ value: null, disabled: true }]
      , status: [{ value: null, disabled: true }]
    });
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.headerData = navigation.extras.state['headerData'];
      this.statData = navigation.extras.state['searchData'];
    }
      this.refreshForm(this.headerData);
      this.findData();
  }


  public ngOnInit(): void {
    if (this.isBrowser) {
      this.checkScreenSize();
    }
    const accountUserName = localStorage.getItem('username');
    if (accountUserName) {
      this.username = accountUserName;
    } else {
      this.username = '';
    }
    this.authService.resetOnUserActivity();
  }

  public navigateToPage(): void {
    this.setLoading(true);
    const params = {
      statData: JSON.stringify(this.statData)
    };
    this.router.navigate(['/history-header'], {
      state: {
        statData: this.statData
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

  public refreshForm(data: any): void{
    this.headerForm.controls['hdrid'].setValue(data.hdrid);
    this.headerForm.controls['payNo'].setValue(data.payNo);
    this.headerForm.controls['cuscode'].setValue(data.cuscode);
    this.headerForm.controls['creusr'].setValue(data.creusr);
    this.headerForm.controls['credate'].setValue(data.credate);
    this.headerForm.controls['bank'].setValue(data.bank);
    this.headerForm.controls['card'].setValue(data.card);
    this.headerForm.controls['amt'].setValue(data.amt);
    this.headerForm.controls['feeAmt'].setValue(data.feeAmt);
    this.headerForm.controls['totalAmt'].setValue(data.totalAmt);
    this.headerForm.controls['status'].setValue(data.stat);
  }

  private populateForm(): void {
    this.findDataDetail.hdrid = this.headerForm.controls['hdrid'].value || '';
    this.findDataDetail.page_start =  this.page_start
    this.findDataDetail.page_limit=  this.page_limit 
  }


  public findData(): void {
    this.setLoading(true); 
    this.populateForm();
  
    this.api.findPaymentDetail(this.findDataDetail).subscribe((result: any) => {
      this.allData = result.data.map((invoice: any) => ({
        docType: invoice.docType
        , docNo: invoice.docNo
        , docAmt: this.formatAmount(invoice.docAmt)
        , balAmt: this.formatAmount(invoice.balAmt)
        , paidAmt: this.formatAmount(invoice.paidAmt)
        , docDate: this.formatDate(invoice.docDate, '/')
        , dueDate: this.formatDate(invoice.dueDate, '/')
        , refDoc: invoice.refDoc
        , term: invoice.term
        , stat: this.statusPayment(invoice.stat)
        , note: invoice.note
      }));
      this.dataSource.data = this.allData;
      this.totalRecords = result.total;
      this.setLoading(false);
    }, (error: any) => {
      console.log('Error during fetch:', error);
      this.setLoading(false); // Hide loading state if error occurs
    });
  }



  public onPageChanged(event: { pageStart: number, pageLimit: number }) {
    this.page_start = event.pageStart;
    this.page_limit = event.pageLimit;
    this.findData();
  }

  public updateRecord(record: any): void {
    this.setLoading(true);
    const data = {
      usrname: record.uswusrname,  // Assuming this is your unique key to identify the record
      usrrole: record.uswrole,
      usrstat: record.uswstat
    }
    this.api.updateDataToWork(data).subscribe((response: any) => {
      this.findData();
    }, (error: any) => {
        console.error('Error updating user:', error);
    });
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

  public saveData(): void {
    this.setLoading(true);
    this.api.saveData().subscribe((response: any) => {
      this.popup('savesucess');
      this.setLoading(false);
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
    if (stat === 'S') {
      statinv = 'Success';
    } else if (stat === 'P') {
      statinv = 'Process';
    } else if (stat === 'E') {
      statinv = 'Expire';
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
