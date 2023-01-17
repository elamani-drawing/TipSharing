import { TestBed } from '@angular/core/testing';
import { CoreModule } from '../core.module';

import { AloneAnonymeGuard } from './alone-anonyme.guard';

describe('AloneAnonymeGuard', () => {
  let guard: AloneAnonymeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule
      ],
    });
    guard = TestBed.inject(AloneAnonymeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
