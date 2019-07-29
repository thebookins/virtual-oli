import { TestBed } from '@angular/core/testing';

import { CgmService } from './cgm.service';

describe('CgmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CgmService = TestBed.get(CgmService);
    expect(service).toBeTruthy();
  });
});
