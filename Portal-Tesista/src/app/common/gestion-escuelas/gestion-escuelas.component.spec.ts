import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionEscuelasComponent } from './gestion-escuelas.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input } from '@angular/core';
import { MenuAdminComponent } from '../menu-admin/menu-admin.component';
import { CONST } from '../const/const';

@Component({
  selector: 'app-home-header',
  template: '' // Mock del HomeHeaderComponent
})
class MockHomeHeaderComponent {
  @Input() userRepresentation: any;
}

describe('GestionEscuelasComponent', () => { afterEach(() => { TestBed.resetTestingModule(); });
  let component: GestionEscuelasComponent;
  let fixture: ComponentFixture<GestionEscuelasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        GestionEscuelasComponent,
        MockHomeHeaderComponent, // Usar el mock en lugar del componente real
        MenuAdminComponent
      ],
      imports: [
        HttpClientTestingModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionEscuelasComponent);
    component = fixture.componentInstance;

    component.userRepresentation = CONST.userRepresentation;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

