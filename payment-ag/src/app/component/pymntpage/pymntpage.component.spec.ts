import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PymntpageComponent } from './pymntpage.component';

describe('PymntpageComponent', () => {
  let component: PymntpageComponent;
  let fixture: ComponentFixture<PymntpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PymntpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PymntpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
