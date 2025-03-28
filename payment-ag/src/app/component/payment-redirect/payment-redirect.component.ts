import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-redirect',
  imports:[ CommonModule],
  templateUrl: './payment-redirect.component.html',
  styleUrls: ['./payment-redirect.component.css']
})
export class PaymentRedirectComponent implements OnInit {

  paymentData: any;
  bankUrl: string = 'https://testpaygate.ktc.co.th/ktc/eng/merchandize/payment/payForm.jsp';  // Bank's payment URL Test
  // bankUrl: string = 'https://paygate.ktc.co.th/ktc/eng/merchandize/payment/payForm.jsp';  // Bank's payment URL TestProd

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Listen to the query parameters from the URL
    this.route.queryParams.subscribe(params => {
      this.paymentData = params;
      console.log('Payment Data:', this.paymentData);  // For debugging

      // Automatically submit the form after 1 second
      this.submitPaymentForm();
    });
  }

  // Function to submit the payment form
  submitPaymentForm(): void {
    const paymentForm = document.getElementById('paymentForm') as HTMLFormElement;
    if (paymentForm) {
      console.log('Payment Form:', paymentForm);  // For debugging
      paymentForm.submit();  // Submit the form to the bank
    }
  }

  // Helper function to get object keys
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

}
