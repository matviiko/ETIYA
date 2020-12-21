import { CountriesStateModel } from './Model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { CountryService } from '../shared/services/country.service';
import { Observable } from 'rxjs';
import { Country } from '../shared/interfaces';
import { map, tap } from 'rxjs/operators';
import { GetAllCountries } from '../actions/countries.action';

@State<CountriesStateModel>({
  name: 'countries',
  defaults: {
    countriesList: [],
  },
})

@Injectable()
export class CountriesState {
  constructor(private countryService: CountryService) {
  }

  @Selector()
  static getCountriesList({ countriesList }: CountriesStateModel): Array<string> | undefined {
    return countriesList;
  }

  @Action(GetAllCountries)
  getAllUsers({ patchState }: StateContext<CountriesStateModel>): Observable<Array<string>> {
    return this.countryService.getAllCountries().pipe(map((countries: Array<Country>) => {
        return countries.map(item => item.name);
      }),
      tap(countriesList => patchState({ countriesList })));
  }
}

