import { Component, ElementRef, EventEmitter, HostListener, ViewChild  } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PopupComponent } from "../shared/popup/popup.component";
import { CommonModule } from '@angular/common';
import { SearchInv } from '../../interface/payment-interface';
import { ApiService } from '../../service/api.service';
import { firstValueFrom } from 'rxjs';
import { AgGridModule } from 'ag-grid-angular';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';

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
    ],
  templateUrl: './mnusrpage.component.html',
  styleUrl: './mnusrpage.component.css',
})
export class MnusrpageComponent {
  @ViewChild('table', { static: true }) table!: ElementRef;

  public resizing: boolean = false;
  currentColumn: HTMLElement | null = null;
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
  }

  private populateForm(): void {
    // this.searchData.customer_code = this.headerForm.controls['cuscode'].value;
    // this.searchData.invno = this.headerForm.controls['invNo'].value;
  }


  public findData(): void {
    const accountRole = localStorage.getItem('accountRole'); 
    if (!accountRole) {
      this.allData = []; // Ensure no data is displayed
      this.setLoading(false);
      return;
    }
    this.api.findDataPending().subscribe((result: any) => {
      if (accountRole === 'user') {
        this.allData = []; // Clear data for 'user' role
        this.setLoading(false);
      } else {
        this.allData = result.data;
        this.setLoading(false);
      }
    }, (error: any) => {
      console.log('Error during login:', error);
    });
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

  public saveData(): void {
    this.setLoading(true);
    this.api.saveData().subscribe((response: any) => {
      this.popup('savesucess');
    }, (error: any) => {
        console.error('Error updating user:', error);
      }
    );
  }


  
 // This will handle mousemove event when resizing
  @HostListener('document:mousemove', ['$event'])
  onMouseMove = (event: MouseEvent): void => {
    if (this.resizing && this.currentColumn) {
      const deltaX = event.clientX - this.startX;
      this.currentColumn.style.width = `${this.startWidth + deltaX}px`;
    }
  };

  // This will handle the mouseup event to stop resizing
  @HostListener('document:mouseup', [])
  onMouseUp = (): void => {
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

