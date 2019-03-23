import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntinfoComponent } from './entinfo.component';

describe('EntinfoComponent', () => {
  let component: EntinfoComponent;
  let fixture: ComponentFixture<EntinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
