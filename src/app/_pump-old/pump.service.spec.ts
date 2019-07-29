import { TestBed, inject } from '@angular/core/testing';

import { PumpService } from './pump.service';

describe('PumpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PumpService]
    });
  });

  it('should be created', inject([PumpService], (service: PumpService) => {
    expect(service).toBeTruthy();
  }));
});
