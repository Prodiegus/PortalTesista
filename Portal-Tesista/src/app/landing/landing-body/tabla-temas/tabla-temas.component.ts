import {Component, OnInit} from '@angular/core';
import { CONST } from '../../../common/const/const';
import {Observable} from 'rxjs';
import {HttpRequestService} from '../../../common/Http-request.service';

@Component({
  selector: 'app-tabla-temas',
  templateUrl: './tabla-temas.component.html',
  styleUrl: './tabla-temas.component.scss'
})
export class TablaTemasComponent implements OnInit{
  protected temas:any[] = [];
  loading = true;

  constructor(
    private httpRequestService: HttpRequestService
  ) {}

  ngOnInit() {
    try {
      this.fetchTemas();
    } catch (error) {
      console.error('Error fetching temas');
    } finally {
      this.loading = false;
    }
  }

  async fetchTemas(): Promise<Observable<any>> {
    return new Promise<Observable<any>>((resolve, reject) => {
      this.httpRequestService.getTemas().then(observable => {
        observable.subscribe(
          (data: any) => {
            this.temas = data;
            resolve(observable);
          },
          (error: any) => {
            console.error('Error fetching temas');
            reject(error);
          }
        );
      });
    });
  }

  detalleTema(tema: any) {
    console.log(tema);
  }

}
