import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/shared/shared.module';

import { TipsListComponent } from './tips-list.component';

describe('TipsListComponent', () => {
  let component: TipsListComponent;
  let fixture: ComponentFixture<TipsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipsListComponent ],
      imports: [
        SharedModule,
        HttpClientModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
