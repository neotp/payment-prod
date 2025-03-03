import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-redirect',
  imports:[ CommonModule],
  templateUrl: './payment-redirect.component.html',
  styleUrl: './payment-redirect.component.css'
})
export  class PaymentRedirectComponent implements OnInit {

  paymentData: any;
  bankUrl: string = 'https://testpaygate.ktc.co.th/ktc/merchandize/payment/payForm.jsp'; // Replace with the actual bank URL

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.paymentData = params;
      setTimeout(() => {
        (document.getElementById('paymentForm') as HTMLFormElement).submit();
      }, 1000);
    });
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
  
}
