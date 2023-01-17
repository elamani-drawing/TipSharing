import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfilInfoComponent } from '../profil-info/profil-info.component';

import { ProfilIdentifiantComponent } from './profil-identifiant.component';

describe('ProfilIdentifiantComponent', () => {
  let component: ProfilIdentifiantComponent;
  let fixture: ComponentFixture<ProfilIdentifiantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilIdentifiantComponent, ProfilInfoComponent ],
      imports: [
        HttpClientModule,
        SharedModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilIdentifiantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
