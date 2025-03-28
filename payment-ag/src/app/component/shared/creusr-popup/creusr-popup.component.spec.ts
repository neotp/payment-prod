import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreusrPopupComponent } from './creusr-popup.component';

describe('CreusrPopupComponent', () => {
  let component: CreusrPopupComponent;
  let fixture: ComponentFixture<CreusrPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreusrPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreusrPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
