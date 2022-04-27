import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionObjectScreenComponent } from './action-object-screen.component';

describe('ActionObjectScreenComponent', () => {
  let component: ActionObjectScreenComponent;
  let fixture: ComponentFixture<ActionObjectScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionObjectScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionObjectScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
