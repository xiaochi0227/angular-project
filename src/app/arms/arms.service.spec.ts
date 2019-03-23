import { TestBed } from '@angular/core/testing';

import { ArmsService } from './arms.service';

describe('ArmsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArmsService = TestBed.get(ArmsService);
    expect(service).toBeTruthy();
  });
});
