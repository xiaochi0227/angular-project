import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskconfigComponent } from './taskconfig.component';

describe('TaskconfigComponent', () => {
  let component: TaskconfigComponent;
  let fixture: ComponentFixture<TaskconfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskconfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
