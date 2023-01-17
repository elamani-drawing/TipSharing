import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { TipSupValComponent } from 'src/app/tips/components/tip-sup-val/tip-sup-val.component';

import { AdminTipsComponent } from './admin-tips.component';

describe('AdminTipsComponent', () => {
  let component: AdminTipsComponent;
  let fixture: ComponentFixture<AdminTipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminTipsComponent, TipSupValComponent ],
      imports: [
        SharedModule,
        HttpClientModule
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
