import {Component, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {HttpRequestService} from '../../../common/Http-request.service';
import { observable, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { el } from 'date-fns/locale';
import { ConfirmDialogComponent } from '../../../common/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-tema-popup',
  templateUrl: './tema-popup.component.html',
  styleUrl: './tema-popup.component.scss'
})
export class TemaPopupComponent {
  @Input() tema: any;
  @Output() close = new EventEmitter<void>();
  @Output() solicitar = new EventEmitter<void>();

  avance: any;
  descargando: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private httpRequestService: HttpRequestService,
    private dialog: MatDialog,
  ) {}

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.closeOverlay();
    }
  }

  closeOverlay(){
    this.close.emit();
  }

  solicitarTema(){
    this.solicitar.emit();
  };

  async descargarTema(){
    this.descargando = true;
    try {
      await this.getUltimoAvance();
    }catch (error) {
      console.error('Error descargando tema:', error);
    } finally {
      if (this.avance) {
        this.descargarArchivo(this.avance.archivo, this.avance.nombre_archivo);
      } else {
        this.dialog.open(ConfirmDialogComponent, {
          data: {
            title: 'Error',
            message: 'No hay archivo disponible para descargar.',
            isAlert: true,
          }
        });
      }
      this.descargando = false;
    }
  };

  async getUltimoAvance() {
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.getUltimoAvanceTema(this.tema.id).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.avance = data;
            resolve(data);
          },
          (error: any) => {
            console.error('Error obteniendo eventos');
            reject(error);
          }
        );
      });
    });
  }

  descargarArchivo(archivo: any, nombre_archivo: string) {
    if (!archivo) {
      console.error('No file available to download');
      return;
    }

    try {
      let base64String = archivo;

      if (base64String.startsWith('data:application/pdf;base64,')) {
        base64String = base64String.replace('data:application/pdf;base64,', '');
      }

      // Decode the Base64 string
      const byteCharacters = atob(base64String);
      const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);

      // Create a Blob from the byte array
      const blob = new Blob([byteArray], { type: 'application/pdf'});
      const url = URL.createObjectURL(blob);

      // Create a temporary link and trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = nombre_archivo || 'archivo_portal_tesita.pdf';
      a.click();

      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error decoding or downloading file:', error);
    }
  }
}
