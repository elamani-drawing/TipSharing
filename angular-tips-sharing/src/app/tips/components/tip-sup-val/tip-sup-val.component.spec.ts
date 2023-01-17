import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/shared/shared.module';

import { TipSupValComponent } from './tip-sup-val.component';

describe('TipSupValComponent', () => {
  let component: TipSupValComponent;
  let fixture: ComponentFixture<TipSupValComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipSupValComponent ],
      imports: [
        SharedModule,
        HttpClientModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipSupValComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
