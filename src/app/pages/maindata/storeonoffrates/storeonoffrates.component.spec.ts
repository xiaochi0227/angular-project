import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreonoffratesComponent } from './storeonoffrates.component';

describe('StoreonoffratesComponent', () => {
  let component: StoreonoffratesComponent;
  let fixture: ComponentFixture<StoreonoffratesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreonoffratesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreonoffratesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
