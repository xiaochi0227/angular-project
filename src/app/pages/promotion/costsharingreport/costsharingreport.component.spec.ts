import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostsharingreportComponent } from './costsharingreport.component';

describe('CostsharingreportComponent', () => {
  let component: CostsharingreportComponent;
  let fixture: ComponentFixture<CostsharingreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostsharingreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostsharingreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
