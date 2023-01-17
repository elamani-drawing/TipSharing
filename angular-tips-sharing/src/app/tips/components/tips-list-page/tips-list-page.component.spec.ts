import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { TipsListComponent } from '../tips-list/tips-list.component';

import { TipsListPageComponent } from './tips-list-page.component';

describe('TipsListPageComponent', () => {
  let component: TipsListPageComponent;
  let fixture: ComponentFixture<TipsListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipsListPageComponent, TipsListComponent ],
      imports: [
        SharedModule,
        HttpClientModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
