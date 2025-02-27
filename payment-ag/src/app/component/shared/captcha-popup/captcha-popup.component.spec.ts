import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptchaPopupComponent } from './captcha-popup.component';

describe('CaptchaPopupComponent', () => {
  let component: CaptchaPopupComponent;
  let fixture: ComponentFixture<CaptchaPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaptchaPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaptchaPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
