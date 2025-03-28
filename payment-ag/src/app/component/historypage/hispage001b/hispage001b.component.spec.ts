import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hispage001bComponent } from './hispage001b.component';

describe('Hispage001bComponent', () => {
  let component: Hispage001bComponent;
  let fixture: ComponentFixture<Hispage001bComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hispage001bComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Hispage001bComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
