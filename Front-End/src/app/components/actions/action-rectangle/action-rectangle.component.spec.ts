import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionRectangleComponent } from './action-rectangle.component';

describe('ActionRectangleComponent', () => {
  let component: ActionRectangleComponent;
  let fixture: ComponentFixture<ActionRectangleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionRectangleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionRectangleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
