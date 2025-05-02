import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-avance-tema',
  templateUrl: './avance-tema.component.html',
  styleUrl: './avance-tema.component.scss'
})
export class AvanceTemaComponent implements OnInit{
  @Input() tema: any;
  @Input() userRepresentation: any;
  @Input() avance: any;

  archivo: any;

  @Output() close = new EventEmitter<void>();

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.archivo = this.avance.archivo;
  }

  cerrar() {
    this.close.emit();
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

  visualizarArchivo(archivo: any): SafeResourceUrl | null {
    if (!archivo) {
      console.error('No file available to display');
      return null;
    }

    try {
      if (!archivo.startsWith('data:application/pdf;base64,')) {
        archivo = 'data:application/pdf;base64,' + archivo;
      }
      return this.sanitizer.bypassSecurityTrustResourceUrl(archivo);
    } catch (error) {
      console.error('Error preparing file for display:', error);
      return null;
    }
  }

}
