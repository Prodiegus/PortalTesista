import { Component } from '@angular/core';
import { UserService } from '../../common/user.service';
import { HttpRequestService } from '../../common/Http-request.service';

@Component({
  selector: 'app-profesores',
  templateUrl: './profesores.component.html',
  styleUrl: './profesores.component.scss'
})
export class ProfesoresComponent {
  protected userRepresentation: any;

  constructor(private userService: UserService) { }

  async ngOnInit() {
    this.userRepresentation = this.userService.getUser();
  }

}
