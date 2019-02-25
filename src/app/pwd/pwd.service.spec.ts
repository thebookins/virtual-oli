import { TestBed, inject } from '@angular/core/testing';

import { PwdService } from './pwd.service';

describe('PwdService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PwdService]
    });
  });

  it('should be created', inject([PwdService], (service: PwdService) => {
    expect(service).toBeTruthy();
  }));
});
