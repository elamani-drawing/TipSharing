import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfilInfoComponent } from '../profil-info/profil-info.component';

import { ProfilEditComponent } from './profil-edit.component';

describe('ProfilEditComponent', () => {
  let component: ProfilEditComponent;
  let fixture: ComponentFixture<ProfilEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilEditComponent , ProfilInfoComponent],
      imports: [
        SharedModule,
        HttpClientModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
