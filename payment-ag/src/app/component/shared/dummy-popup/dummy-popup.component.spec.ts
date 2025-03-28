import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DummyPopupComponent } from './dummy-popup.component';

describe('DummyPopupComponent', () => {
  let component: DummyPopupComponent;
  let fixture: ComponentFixture<DummyPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DummyPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DummyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
