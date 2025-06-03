import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvanceTemaComponent } from './avance-tema.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DateFormatPipe } from '../../pipe/date-format.pipe';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import {FormsModule} from '@angular/forms';
import {CONST} from '../const/const';

describe('AvanceTemaComponent', () => {
  let component: AvanceTemaComponent;
  let fixture: ComponentFixture<AvanceTemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AvanceTemaComponent,
        DateFormatPipe
      ],
      imports: [
        HttpClientTestingModule,
        PdfViewerModule,
        FormsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvanceTemaComponent);
    component = fixture.componentInstance;

    component.userRepresentation = CONST.userRepresentation;
    component.tema = CONST.temas[0];
    component.avance = CONST.avances[0];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
