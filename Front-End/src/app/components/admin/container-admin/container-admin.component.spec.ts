import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerAdminComponent } from './container-admin.component';

describe('ContainerAdminComponent', () => {
  let component: ContainerAdminComponent;
  let fixture: ComponentFixture<ContainerAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
