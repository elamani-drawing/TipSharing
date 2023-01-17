import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/shared/shared.module';

import { AdminSingleTipsComponent } from './admin-single-tips.component';

describe('AdminSingleTipsComponent', () => {
  let component: AdminSingleTipsComponent;
  let fixture: ComponentFixture<AdminSingleTipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminSingleTipsComponent ],
      imports: [
        SharedModule,
        HttpClientModule
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSingleTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
