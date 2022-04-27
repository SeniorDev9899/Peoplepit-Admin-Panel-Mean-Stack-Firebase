import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldSingleselectComponent } from './field-singleselect.component';

describe('FieldSingleselectComponent', () => {
  let component: FieldSingleselectComponent;
  let fixture: ComponentFixture<FieldSingleselectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldSingleselectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldSingleselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
