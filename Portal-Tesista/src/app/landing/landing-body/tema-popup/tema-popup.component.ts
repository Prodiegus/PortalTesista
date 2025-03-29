import {Component, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {HttpRequestService} from '../../../common/Http-request.service';

@Component({
  selector: 'app-tema-popup',
  templateUrl: './tema-popup.component.html',
  styleUrl: './tema-popup.component.scss'
})
export class TemaPopupComponent {
  @Input() tema: any;
  @Output() close = new EventEmitter<void>();
  @Output() solicitar = new EventEmitter<void>();

  constructor(
    private elementRef: ElementRef,
    private httpRequestService: HttpRequestService
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

  descargarTema(){
    console.log(this.tema);
  };
}
