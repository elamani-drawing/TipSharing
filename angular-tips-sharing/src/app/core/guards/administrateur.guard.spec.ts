import { TestBed } from '@angular/core/testing';
import { CoreModule } from '../core.module';

import { AdministrateurGuard } from './administrateur.guard';

describe('AdministrateurGuard', () => {
  let guard: AdministrateurGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule
      ],
    });
    guard = TestBed.inject(AdministrateurGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
