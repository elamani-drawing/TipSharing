import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AdminModule } from '../admin.module';

import { AdminService } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AdminModule,
        HttpClientModule
      ],
    });
    service = TestBed.inject(AdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
