import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from '../core.module';

import { TipsService } from './tips.service';

describe('TipsService', () => {
  let service: TipsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule
      ],
    });
    service = TestBed.inject(TipsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
