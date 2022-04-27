import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldSimpletextComponent } from './field-simpletext.component';

describe('FieldSimpletextComponent', () => {
  let component: FieldSimpletextComponent;
  let fixture: ComponentFixture<FieldSimpletextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldSimpletextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldSimpletextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
