import { TestBed } from '@angular/core/testing';
import { CoreModule } from '../core.module';

import { CoockieStorageService } from './coockie-storage.service';

describe('CoockieStorageService', () => {
  let service: CoockieStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule
      ],
    });
    service = TestBed.inject(CoockieStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
