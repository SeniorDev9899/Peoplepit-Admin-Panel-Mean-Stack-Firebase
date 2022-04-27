import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldAdminComponent } from './field-admin.component';

describe('FieldAdminComponent', () => {
  let component: FieldAdminComponent;
  let fixture: ComponentFixture<FieldAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
