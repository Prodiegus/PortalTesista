import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { HttpRequestService } from '../Http-request.service';

@Component({
  selector: 'app-agregar-tema',
  templateUrl: './agregar-tema.component.html',
  styleUrl: './agregar-tema.component.scss'
})
export class AgregarTemaComponent {
  @Input() userRepresentation!: any;

  @Output() close = new EventEmitter<void>();

  loading = false;

  constructor(
    private elementRef: ElementRef,
    private httpRequestService: HttpRequestService
  ) { }

  async onSubmit() {
    this.loading = true;

    this.loading = false;
    this.closeOverlay();
  }

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.closeOverlay();
    }
  }

  closeOverlay() {
    this.close.emit();
  }
}
