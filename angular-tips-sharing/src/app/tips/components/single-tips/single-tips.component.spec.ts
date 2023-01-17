import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { SingleTipsComponent } from './single-tips.component';

describe('SingleTipsComponent', () => {
  let component: SingleTipsComponent;
  let fixture: ComponentFixture<SingleTipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleTipsComponent ],
      imports: [
        SharedModule,
        HttpClientModule,
        CoreModule,
        RouterTestingModule
      ],
      providers: [

      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
