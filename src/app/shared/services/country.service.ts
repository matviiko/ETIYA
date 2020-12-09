import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Country} from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private http: HttpClient) {
  }

  getAllCountries(): Observable<Array<Country>> {
    return this.http.get<Array<Country>>('https://restcountries.eu/rest/v2/all');
  }
}
