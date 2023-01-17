import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminListComponent } from './admin-list.component';

describe('AdminListComponent', () => {
  let component: AdminListComponent;
  let fixture: ComponentFixture<AdminListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminListComponent ],
      imports: [
        SharedModule,
        HttpClientModule
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
