import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/shared/shared.module';

import { CommentaireTipsComponent } from './commentaire-tips.component';

describe('CommentaireTipsComponent', () => {
  let component: CommentaireTipsComponent;
  let fixture: ComponentFixture<CommentaireTipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentaireTipsComponent ],
      imports: [
        SharedModule,
        HttpClientModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentaireTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
