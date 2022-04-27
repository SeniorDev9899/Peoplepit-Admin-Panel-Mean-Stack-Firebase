import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectAdminComponent } from './object-admin.component';

describe('ObjectAdminComponent', () => {
  let component: ObjectAdminComponent;
  let fixture: ComponentFixture<ObjectAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
