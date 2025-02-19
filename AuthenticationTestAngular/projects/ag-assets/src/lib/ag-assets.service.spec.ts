import { TestBed } from '@angular/core/testing';

import { AgAssetsService } from './ag-assets.service';

describe('AgAssetsService', () => {
  let service: AgAssetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgAssetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
