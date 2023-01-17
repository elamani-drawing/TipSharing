import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/shared/shared.module';

import { TagInputComponent } from './tag-input.component';

describe('TagInputComponent', () => {
  let component: TagInputComponent;
  let fixture: ComponentFixture<TagInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagInputComponent ],
      imports: [
        SharedModule,
        HttpClientModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
