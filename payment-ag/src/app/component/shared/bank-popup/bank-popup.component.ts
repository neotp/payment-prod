import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { ApiService } from '../../../service/api.service';


@Component({
  selector: 'app-bank-popup',
  imports: [
    CommonModule
    , FormsModule
    , LoadingSpinnerComponent
    ],
  templateUrl: './bank-popup.component.html',
  styleUrl: './bank-popup.component.css'
})
export class BankPopupComponent {
  @Input() title: string = 'Payment Details';
  @Input() balanceAmount: number = 0.00;
  // @Input() serviceCharge: number = 0.00;
  // @Input() totalAmount: number = 0.00;

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<{ totalAmount: number; serviceCharge: number; card: string; bank:string; }>();

  public bankOption: string = 'ktc';
  public cardOption: string = '';
  public isLoading = false;
  public serviceCharge: number = 0.00;
  public totalAmount: number = 0.00;
  public feeper: number = 0.00;
  constructor(
      private api: ApiService
    ){}

  public onBankChange() {
    this.cardOption = ''; 
  }

  public onCardChange() {
    this.setLoading(true);
    const data = {
      bank: this.bankOption,
      card: this.cardOption
    }
    this.api.findfeeRate(data).subscribe((result: any) => {
      this.serviceCharge = parseFloat(Number(this.balanceAmount * ( parseFloat(result.feeRate) * (1/100))).toFixed(2)); 
      this.totalAmount = parseFloat(Number(this.balanceAmount + this.serviceCharge).toFixed(2));
      this.feeper = result.feeRate;
      this.setLoading(false);
    }, (error: any) => {
      console.log('Error during login:', error);
      this.setLoading(false);
    });
  }

  public closePopup() {
    this.close.emit();
  }

  public confirmAction() {
    this.confirm.emit({ 
      totalAmount: this.totalAmount, 
      serviceCharge: this.serviceCharge, 
      card: this.cardOption, 
      bank: this.bankOption 
    });
    this.closePopup();
  }
  
  public setLoading(isLoading: boolean) {
    console.log('Loading status:', isLoading); // Debug
    this.isLoading = isLoading;
  }
}
