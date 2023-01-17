import { TestBed } from '@angular/core/testing';
import { CoreModule } from '../core.module';

import { ProfilService } from './profil.service';

describe('ProfilService', () => {
  let service: ProfilService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule
      ],
    });
    service = TestBed.inject(ProfilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
