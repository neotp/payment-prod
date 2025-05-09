import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRedirectComponent } from './payment-redirect.component';

describe('PaymentRedirectComponent', () => {
  let component: PaymentRedirectComponent;
  let fixture: ComponentFixture<PaymentRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentRedirectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
