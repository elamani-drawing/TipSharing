import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { TipsListComponent } from 'src/app/tips/components/tips-list/tips-list.component';
import { ProfilInfoComponent } from '../profil-info/profil-info.component';

import { ProfilComponent } from './profil.component';

describe('ProfilComponent', () => {
  let component: ProfilComponent;
  let fixture: ComponentFixture<ProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilComponent, ProfilInfoComponent, TipsListComponent ],
      imports : [
        SharedModule,
        HttpClientModule,
        RouterTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
