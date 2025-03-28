import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hispage001aComponent } from './hispage001a.component';

describe('Hispage001aComponent', () => {
  let component: Hispage001aComponent;
  let fixture: ComponentFixture<Hispage001aComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hispage001aComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Hispage001aComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
