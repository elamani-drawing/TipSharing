import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { TipSupValComponent } from 'src/app/tips/components/tip-sup-val/tip-sup-val.component';

import { GestionTipsComponent } from './gestion-tips.component';

describe('GestionTipsComponent', () => {
  let component: GestionTipsComponent;
  let fixture: ComponentFixture<GestionTipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionTipsComponent , TipSupValComponent],
      imports : [
        SharedModule,
        HttpClientModule, 
        RouterTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
