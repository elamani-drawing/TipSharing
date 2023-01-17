import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { CoreModule } from 'src/app/core/core.module';

import { LoginRegisterService } from './login-register.service';

describe('LoginRegisterService', () => {
  let service: LoginRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        HttpClientModule
      ],
    });
    service = TestBed.inject(LoginRegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
