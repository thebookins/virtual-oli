import { TestBed, inject } from '@angular/core/testing';

import { CgmService } from './cgm.service';

describe('CgmService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CgmService]
    });
  });

  it('should be created', inject([CgmService], (service: CgmService) => {
    expect(service).toBeTruthy();
  }));
});
