import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MnusrpageComponent } from './mnusrpage.component';

describe('MnusrpageComponent', () => {
  let component: MnusrpageComponent;
  let fixture: ComponentFixture<MnusrpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MnusrpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MnusrpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
