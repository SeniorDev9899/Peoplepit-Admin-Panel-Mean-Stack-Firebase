import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldMultiAutocompleteComponent } from './field-multi-autocomplete.component';

describe('FieldMultiAutocompleteComponent', () => {
  let component: FieldMultiAutocompleteComponent;
  let fixture: ComponentFixture<FieldMultiAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldMultiAutocompleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldMultiAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
