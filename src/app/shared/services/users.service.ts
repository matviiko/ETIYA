import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  create(user: User): Observable<User> {
    return this.http.post<User>('http://localhost:3000/profiles', user);
  }

  getAllUsers(): Observable<Array<User>> {
    return this.http.get<Array<User>>('http://localhost:3000/profiles');
  }

  getUsersById(id: number): Observable<User> {
    return this.http.get<User>(`http://localhost:3000/profiles/${id}`);
  }

  save(user: User): Observable<User> {
    return this.http.put<User>(`http://localhost:3000/profiles/${user.id}`, user);
  }

  update(user: User): Observable<User> {
    return this.http.patch<User>(`http://localhost:3000/profiles/${user.id}`, user);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:3000/profiles/${id}`);
  }
}
