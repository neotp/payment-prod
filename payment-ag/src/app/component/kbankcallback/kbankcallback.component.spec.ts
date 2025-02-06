import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KbankcallbackComponent } from './kbankcallback.component';

describe('KbankcallbackComponent', () => {
  let component: KbankcallbackComponent;
  let fixture: ComponentFixture<KbankcallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KbankcallbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KbankcallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
