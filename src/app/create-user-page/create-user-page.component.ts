import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryService } from '../shared/services/country.service';
import { MastMatch } from '../shared/must-match.validator';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UsersService } from '../shared/services/users.service';
import { Address } from '../shared/interfaces';

@Component({
  selector: 'app-create-user-page',
  templateUrl: './create-user-page.component.html',
  styleUrls: ['./create-user-page.component.scss'],
})
export class CreateUserPageComponent implements OnInit, OnDestroy {
  isAddressOpen = false;
  isOpenSummary = false;
  countries: Array<string> = [];
  form!: FormGroup;
  countrySub!: Subscription;

  get alternateAddresses(): FormArray {
    return this.form.get('alternateAddresses') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private router: Router,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        firstName: [
          null,
          [Validators.required, Validators.pattern('^[a-zA-Z ]*$')],
        ],
        lastName: [
          null,
          [Validators.required, Validators.pattern('^[a-zA-Z ]*$')],
        ],
        username: [null, Validators.required],
        phone: [null, Validators.required],
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.minLength(6)]],
        confirmPassword: [null, Validators.required],
        alternateAddresses: this.fb.array([this.buildAddressForm()]),
      },
      { validators: MastMatch('password', 'confirmPassword') }
    );
    this.countrySub = this.countryService
      .getAllCountries()
      .pipe()
      .subscribe(response => {
        this.countries = response.map(item => item.name);
      });
  }

  onChangeTabs(): void {
    this.isAddressOpen = !this.isAddressOpen;
  }

  addAlternativeAddresses(): void {
    this.alternateAddresses.push(this.buildAddressForm());
  }

  buildAddressForm(): FormGroup {
    return this.fb.group({
      typeAddress: [null, Validators.required],
      address: [null, Validators.required],
      city: [null, Validators.required],
      country: [null, Validators.required],
      postCode: [null, Validators.required],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.onOpenSummary();
  }

  onOpenSummary(): void {
    this.isOpenSummary = !this.isOpenSummary;
  }

  onRemoveData(): void {
    this.form.reset();
    this.router.navigate(['/']);
  }

  onSaveData(): void {
    const user = Object.assign({}, this.form.value);
    user.alternateAddresses = user.alternateAddresses?.map(
      (address: Address, index: number) => ({
        ...address,
        id: index + 1,
      })
    );
    this.usersService.create(user).subscribe(() => {
      this.form.reset();
      this.router.navigate(['/']);
    });
  }

  deleteAddress(index: number): void {
    this.alternateAddresses.removeAt(index);
  }

  ngOnDestroy(): void {
    this.countrySub.unsubscribe();
  }
}
