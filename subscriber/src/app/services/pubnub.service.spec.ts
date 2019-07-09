import { TestBed } from '@angular/core/testing';

import { PubnubService } from './pubnub.service';

describe('PubnubService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PubnubService = TestBed.get(PubnubService);
    expect(service).toBeTruthy();
  });
});
