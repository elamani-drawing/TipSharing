import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/shared/shared.module';

import { AdminMembresComponent } from './admin-membres.component';

describe('AdminMembresComponent', () => {
  let component: AdminMembresComponent;
  let fixture: ComponentFixture<AdminMembresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminMembresComponent ],
      imports: [
        SharedModule,
        HttpClientModule
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMembresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
