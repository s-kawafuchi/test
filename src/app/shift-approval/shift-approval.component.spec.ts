import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftApprovalComponent } from './shift-approval.component';

describe('ShiftApprovalComponent', () => {
  let component: ShiftApprovalComponent;
  let fixture: ComponentFixture<ShiftApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
