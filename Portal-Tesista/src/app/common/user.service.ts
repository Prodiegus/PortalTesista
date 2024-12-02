import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userRepresentation: any;

  setUser(user: any) {
    this.userRepresentation = user;
  }

  public getUser(): any {
    return this.userRepresentation;
  }
}