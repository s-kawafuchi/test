import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveComfirmComponent } from './reserve-comfirm.component';

describe('ReserveComfirmComponent', () => {
  let component: ReserveComfirmComponent;
  let fixture: ComponentFixture<ReserveComfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReserveComfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReserveComfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
