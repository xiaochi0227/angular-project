import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassifysynchroComponent } from './classifysynchro.component';

describe('ClassifysynchroComponent', () => {
  let component: ClassifysynchroComponent;
  let fixture: ComponentFixture<ClassifysynchroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassifysynchroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassifysynchroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
