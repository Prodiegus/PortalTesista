import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarFlujoComponent } from './editar-flujo.component';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CONST} from '../../const/const';

describe('EditarFlujoComponent', () => {
  let component: EditarFlujoComponent;
  let fixture: ComponentFixture<EditarFlujoComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarFlujoComponent],
      providers:  [
        {
          provide: Router,
          useValue: {
            getCurrentNavigation: () => ({
              extras: {
                state: {
                  userRepresentation: CONST.userRepresentation,
                  tema: CONST.temas[0]
                }
              }
            }),
            navigate: jasmine.createSpy('navigate')
          }
        }
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarFlujoComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    component.userRepresentation = CONST.userRepresentation;
    component.tema = CONST.temas[0];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /home if userRepresentation is missing', () => {
    component.userRepresentation = null;
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should navigate to /home if tema is missing', () => {
    component.tema = null;
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should not navigate if userRepresentation and tema are present', () => {
    component.ngOnInit();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
