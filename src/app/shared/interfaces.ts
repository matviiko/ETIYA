export interface Country {
  alpha2Code: string;
  alpha3Code: string;
  altSpellings: Array<any>;
  area: number;
  borders: Array<any>;
  callingCodes: Array<any>;
  capital: string;
  cioc: string;
  currencies: Array<any>;
  demonym: string;
  flag: string;
  gini: number;
  languages: Array<any>;
  latlng: Array<any>;
  name: string;
  nativeName: string;
  numericCode: string;
  population: number;
  region: string;
  regionalBlocs: Array<any>;
  subregion: string;
  timezones: Array<string>;
  topLevelDomain: Array<string>;
  translations: any;
}

export interface User {
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  email: string;
  password: string;
  alternateAddresses?: Array<Address>;
  id: number;
  isShowEditAddressRow?: number;
}

export interface Address {
  typeAddress: string;
  address: string;
  city: string;
  country: string;
  postCode: string;
  id: number;
}
