import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { ApiService } from '../../../service/api.service';
import { CreatSo } from '../../../interface/dummy-interface';

@Component({
  selector: 'app-dummy-popup',
   imports: [
      CommonModule
      , FormsModule
      , LoadingSpinnerComponent
      , ReactiveFormsModule
      ],
  templateUrl: './dummy-popup.component.html',
  styleUrl: './dummy-popup.component.css',
})
export class DummyPopupComponent {
  @Input() title: string = 'For Order Release';
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<CreatSo>();

  public headerForm!: FormGroup;
  public usageOption: string = '';
  public isLoading = false;
  public creatSo = {} as CreatSo;


  constructor(
      private formBuilder: FormBuilder,
      private api: ApiService, 
    ){ 
      this.headerForm = this.formBuilder.group({
      docType: [{ value: 'SO', disabled: true }, Validators.required]
      , docNo: [{ value: null, disabled: false }, [Validators.required, Validators.maxLength(10)]]
      , docAmt: [{ value: null, disabled: false }, Validators.required]
      , usage: [{ value: null, disabled: false }, Validators.required]
      , note: [{ value: null, disabled: false }]
    });}


  public ngOnInit(): void {
    this.headerForm.controls['docType'].setValue('SO');
  }
  private populateForm(): void {
    this.creatSo.docType = this.headerForm.controls['docType'].value;
    this.creatSo.docNo   = this.headerForm.controls['docNo'].value;
    this.creatSo.docAmt  = this.headerForm.controls['docAmt'].value;
    this.creatSo.usage   = this.headerForm.controls['usage'].value;
    this.creatSo.note    = this.headerForm.controls['note'].value;
  }

 

  public formatFinalAmount(): void {
    let value = this.headerForm.get('docAmt')?.value;

    if (value !== null && value !== undefined) {
      value = value.toString().replace(/,/g, '');
      
      const numericValue = parseFloat(value);
      
      if (!isNaN(numericValue)) {
        this.headerForm.patchValue({ docAmt: numericValue.toFixed(2) }, { emitEvent: false });
      
        const formattedValue = this.formatNumberWithCommas(numericValue.toFixed(2));
      
        setTimeout(() => {
          const inputField = document.getElementById('docAmt') as HTMLInputElement;
          if (inputField) inputField.value = formattedValue;
        });
      }
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

  public closePopup() {
    this.close.emit();
  }

  public confirmAction() {
    this.populateForm();
    if (this.creatSo.note === '' || !this.creatSo.note ){
      this.creatSo.note = '-'
    }
    this.confirm.emit({ 
      cuscode: ''
      , docType: this.creatSo.docType
      , docNo: this.creatSo.docNo  
      , docAmt: this.creatSo.docAmt 
      , usage: this.creatSo.usage  
      , note: this.creatSo.note   
    });
    
    this.closePopup();
  }
  
  public setLoading(isLoading: boolean) {
    console.log('Loading status:', isLoading); // Debug
    this.isLoading = isLoading;
  }
  
}
