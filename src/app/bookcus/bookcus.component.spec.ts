import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookcusComponent } from './bookcus.component';

describe('BookcusComponent', () => {
  let component: BookcusComponent;
  let fixture: ComponentFixture<BookcusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookcusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookcusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
