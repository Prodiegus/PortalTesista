import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpRequestService} from '../Http-request.service';

@Component({
  selector: 'app-avance-tema',
  templateUrl: './avance-tema.component.html',
  styleUrl: './avance-tema.component.scss'
})
export class AvanceTemaComponent implements OnInit{
  @Input() tema: any;
  @Input() userRepresentation: any;
  @Input() avance: any;
  @Input() revision?: boolean = false;

  @Output() close = new EventEmitter<void>();

  pdfSrc?: string;

  pageInput: number = 1;
  page = 1;
  totalPages = 0;
  zoom: number = 1.0;

  constructor(
    private httpRequestService: HttpRequestService
  ) {}

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
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        // Remove the prefix if present
        let base64 = (reader.result as string);
        if (base64.startsWith('data:application/pdf;base64,')) {
          base64 = base64.replace('data:application/pdf;base64,', '');
        } else if (base64.startsWith('data:')) {
          base64 = base64.substring(base64.indexOf(',') + 1);
        }
        this.avance.feedback = {
          nombre_archivo: file.name,
          archivo: base64
        };
      };
      reader.readAsDataURL(file);
    } else {
      this.avance.feedback = null;
    }
  }

  descargarFeedbackArchivo() {
    if (!this.avance.feedback || !this.avance.feedback.archivo) {
      console.error('No feedback file available to download');
      return;
    }
    try {
      let base64String = this.avance.feedback.archivo;
      const byteCharacters = atob(base64String);
      const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.avance.feedback.nombre_archivo || 'archivo_retroalimentacion.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error decoding or downloading feedback file:', error);
    }
  }

  async onGuardar() {
    const data = {
      nota: this.avance.nota ?? null,
      aprobado: this.avance.aprobado ?? null,
      comentario: this.avance.comentario ?? null,
      archivo: this.avance.feedback?.archivo ?? null,
      id_avance: this.avance.id,
      nombre: this.avance.feedback?.nombre_archivo ?? null,
    };
    console.log(data);
    if (this.revision) {
      // your logic here
    } else {
      await this.subirGuiaReview(data.nota);
    }
  }

  async subirGuiaReview(revision: any){
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.empezarRevisionAvance(revision).then((observable) => {
        observable.subscribe(
          (data: any) => {
            console.log('Revision started successfully');
            resolve();
          },
          (error: any) => {
            console.error('Error starting revision');
            reject(error);
          }
        );
      });
    });
  }

}
