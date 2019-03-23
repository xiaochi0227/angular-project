import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreonoffrateComponent } from './storeonoffrate.component';

describe('StoreonoffrateComponent', () => {
  let component: StoreonoffrateComponent;
  let fixture: ComponentFixture<StoreonoffrateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreonoffrateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreonoffrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
