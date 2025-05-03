import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-avance-tema',
  templateUrl: './avance-tema.component.html',
  styleUrl: './avance-tema.component.scss'
})
export class AvanceTemaComponent implements OnInit{
  @Input() tema: any;
  @Input() userRepresentation: any;
  @Input() avance: any;

  @Output() close = new EventEmitter<void>();

  pdfSrc?: string;

  pageInput: number = 1;
  page = 1;
  totalPages = 0;
  zoom: number = 1.0;

  feedbackFile?: File;

  ngOnInit() {
    if (this.avance?.archivo && this.avance.archivo.trim() !== '') {
      this.pdfSrc = this.avance.archivo.startsWith('data:application/pdf;base64,')
        ? this.avance.archivo
        : 'data:application/pdf;base64,' + this.avance.archivo;
    } else {
      this.pdfSrc = undefined;
    }
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

  goToPage() {
    if (this.pageInput >= 1 && this.pageInput <= this.totalPages) {
      this.page = this.pageInput;
    }
  }
  onPdfLoad(pdf: any) {
    this.totalPages = pdf.numPages;
    this.pageInput = this.page; // Sync input with current page
  }
  goToPreviousPage() {
    if (this.page > 1) {
      this.page--;
      this.pageInput = this.page;
    }
  }
  goToNextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.pageInput = this.page;
    }
  }
  zoomIn() {
    this.zoom += 0.1;
  }

  zoomOut() {
    if (this.zoom > 0.2) {
      this.zoom -= 0.1;
    }
  }

  onFeedbackFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.feedbackFile = input.files[0];
    } else {
      this.feedbackFile = undefined;
    }
  }

}
