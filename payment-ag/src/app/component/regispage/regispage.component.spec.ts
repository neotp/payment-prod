import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegispageComponent } from './regispage.component';

describe('RegispageComponent', () => {
  let component: RegispageComponent;
  let fixture: ComponentFixture<RegispageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegispageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegispageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
