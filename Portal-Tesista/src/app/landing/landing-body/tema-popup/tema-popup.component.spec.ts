import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemaPopupComponent } from './tema-popup.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {DateFormatPipe} from '../../../pipe/date-format.pipe';
import {CONST} from '../../../common/const/const';

describe('TemaPopupComponent', () => {
  let component: TemaPopupComponent;
  let fixture: ComponentFixture<TemaPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TemaPopupComponent,
        DateFormatPipe
      ],
      imports: [
        HttpClientTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemaPopupComponent);
    component = fixture.componentInstance;

    component.tema = CONST.temas[0];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
