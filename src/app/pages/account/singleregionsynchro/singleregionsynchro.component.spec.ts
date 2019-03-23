import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleregionsynchroComponent } from './singleregionsynchro.component';

describe('SingleregionsynchroComponent', () => {
  let component: SingleregionsynchroComponent;
  let fixture: ComponentFixture<SingleregionsynchroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleregionsynchroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleregionsynchroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
