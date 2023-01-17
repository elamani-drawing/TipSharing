import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/shared/shared.module';

import { TipComponent } from './tip.component';

describe('TipComponent', () => {
  let component: TipComponent;
  let fixture: ComponentFixture<TipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipComponent ],
      imports: [
        SharedModule,
        HttpClientModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
