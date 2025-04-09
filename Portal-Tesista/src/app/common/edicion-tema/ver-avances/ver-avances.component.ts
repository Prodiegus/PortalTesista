import {Component, Input, OnInit} from '@angular/core';
import {HttpRequestService} from '../../Http-request.service';

@Component({
  selector: 'app-ver-avances',
  templateUrl: './ver-avances.component.html',
  styleUrl: './ver-avances.component.scss'
})
export class VerAvancesComponent implements OnInit{
  @Input() tema!: any;
  @Input() userRepresentation!: any;

  loading: boolean = false;
  esCargo: boolean = false;

  protected avances!: any;

  constructor(
    private httpRequestService: HttpRequestService
  ) {}


  async ngOnInit() {
    this.loading = true;
    try {
      await this.fetchAvances();
    } catch (e) {
      this.avances = null;
    } finally {
      this.loading = false;
    }
    this.esCargo = this.userRepresentation?.tipo === 'cargo';

  }

  async fetchAvances() {
    return new Promise<void>((resolve, reject) => {
      this.httpRequestService.getAvancesTema(this.tema.id).then(observable => {
        observable.subscribe(
          (data: any) => {
            this.avances = data;
            resolve();
          },
          (error: any) => {
            console.error('Error fetching avances');
            reject(error);
          }
        );
      });
    });
  }
}
