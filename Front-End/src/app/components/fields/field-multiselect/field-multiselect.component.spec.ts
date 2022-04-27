import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldMultiselectComponent } from './field-multiselect.component';

describe('FieldMultiselectComponent', () => {
  let component: FieldMultiselectComponent;
  let fixture: ComponentFixture<FieldMultiselectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldMultiselectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldMultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
