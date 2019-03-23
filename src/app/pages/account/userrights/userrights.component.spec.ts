import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserrightsComponent } from './userrights.component';

describe('UserrightsComponent', () => {
  let component: UserrightsComponent;
  let fixture: ComponentFixture<UserrightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserrightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserrightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
