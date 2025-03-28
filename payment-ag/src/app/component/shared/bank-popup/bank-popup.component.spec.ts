import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankPopupComponent } from './bank-popup.component';

describe('BankPopupComponent', () => {
  let component: BankPopupComponent;
  let fixture: ComponentFixture<BankPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
