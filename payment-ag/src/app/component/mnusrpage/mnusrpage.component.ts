import { Component, ElementRef, EventEmitter, HostListener, Inject, PLATFORM_ID, ViewChild  } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PopupComponent } from "../shared/popup/popup.component";
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SearchInv } from '../../interface/payment-interface';
import { ApiService } from '../../service/api.service';
import { firstValueFrom } from 'rxjs';
import { AgGridModule } from 'ag-grid-angular';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { PagingComponent } from '../shared/paging/paging.component';
import { AuthService } from '../../auth.service'; // Make sure to import the AuthService


@Component({
  selector: 'app-mnusrpage',
    imports: [
      MatIconModule
      , PopupComponent
      , CommonModule
      , FormsModule
      , ReactiveFormsModule
      , AgGridModule
      , LoadingSpinnerComponent
      , MatTableModule
      , MatPaginatorModule
      , MatSortModule
      , PagingComponent
    ],
  templateUrl: './mnusrpage.component.html',
  styleUrl: './mnusrpage.component.css',
})
export class MnusrpageComponent {
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
  public searchData = {} as SearchInv;
  public loadingApp: EventEmitter<boolean> = new EventEmitter(false);
  public headerForm!: FormGroup;
  public isLoading = false;
  public isMobile: boolean = false; 
  public page_start: number = 1;
  public page_limit: number = 10;
  public totalRecords: number = 0;
  public pageSizeOptions: number[] = [ 10, 20, 50, 100];

  public displayedColumns: string[] = ['uswusrname', 'uswfname', 'uswlname', 'uswcuscode', 'uswcusname', 'uswemail', 'uswpos', 'uswrole', 'uswstat'];
  public dataSource = new MatTableDataSource<any>([]);
  private isBrowser: boolean; 

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;;
  constructor(
    private formBuilder: FormBuilder
    , private api: ApiService
    , private authService: AuthService
    , @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.headerForm = this.formBuilder.group({
      cuscode: [{ value: null, disabled: false }]
      , invNo: [{ value: null, disabled: false }]
    });
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
    this.findData();
    this.updateDataNow();
    this.authService.resetOnUserActivity();
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

  private populateForm(): void {
    // this.searchData.customer_code = this.headerForm.controls['cuscode'].value;
    // this.searchData.invno = this.headerForm.controls['invNo'].value;
  }


  public findData(): void {
    const accountRole = localStorage.getItem('accountRole'); 
  
    if (!accountRole) {
      this.allData = []; // Ensure no data is displayed if no account role is found
      this.setLoading(false);
      return;
    }
  
    // Prepare the request data for pagination
    const data = {
      page_start: this.page_start,   // Current page index
      page_limit: this.page_limit    // Current page size
    }
  
    this.setLoading(true); // Show loading state
  
    // Call API to fetch data
    this.api.findDataPending(data).subscribe((result: any) => {
      if (accountRole === 'user') {
        this.allData = []; // Clear data for 'user' role
        this.setLoading(false);
      } else {
        // Process data for other roles (not 'user')
        this.allData = result.data;  // Data from API
        this.dataSource.data = this.allData;  // Bind data to dataSource (for table)
        this.totalRecords = result.total; // Set total items for pagination
        this.setLoading(false); // Hide loading state
      }
    }, (error: any) => {
      console.log('Error during fetch:', error);
      this.setLoading(false); // Hide loading state if error occurs
    });
  }

  // public onPageChange(event: any): void {
  //   console.log('Page changed:', event);
  //   this.page_start = event.pageIndex + 1; // Update page_start when page changes
  //   this.page_limit = event.pageSize;      // Update page_limit when page size changes
  //   this.findData();  // Trigger data fetch
  // }

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
      }
    );
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

