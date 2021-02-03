import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffReserchComponent } from './staff-reserch.component';

describe('StaffReserchComponent', () => {
  let component: StaffReserchComponent;
  let fixture: ComponentFixture<StaffReserchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffReserchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffReserchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
