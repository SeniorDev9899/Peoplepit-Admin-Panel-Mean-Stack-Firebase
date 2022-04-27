import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldSingleAutocompleteComponent } from './field-single-autocomplete.component';

describe('FieldSingleAutocompleteComponent', () => {
  let component: FieldSingleAutocompleteComponent;
  let fixture: ComponentFixture<FieldSingleAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldSingleAutocompleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldSingleAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
