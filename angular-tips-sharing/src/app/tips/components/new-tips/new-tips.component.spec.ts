import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { TagInputComponent } from '../tag-input/tag-input.component';

import { NewTipsComponent } from './new-tips.component';

describe('NewTipsComponent', () => {
  let component: NewTipsComponent;
  let fixture: ComponentFixture<NewTipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTipsComponent, TagInputComponent ],
      imports: [
        SharedModule,
        HttpClientModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
