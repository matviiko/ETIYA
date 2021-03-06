import { Component, OnInit, Self } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../shared/services/users.service';
import { Address, User } from '../shared/interfaces';
import { CountryService } from '../shared/services/country.service';
import { NgOnDestroy } from '../shared/services/ngOnDestroy';
import { takeUntil } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import { GetAllUsers, RemoveUser, SaveUsers } from '../actions/users.actions';
import { GetAllCountries } from '../actions/countries.action';
import { CountriesState } from '../state/countries.state';
import { Observable } from 'rxjs';
import { UsersState } from '../state/users.state';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  providers: [NgOnDestroy],
})
export class MainPageComponent implements OnInit {
  searchForm!: FormGroup;
  editForm!: FormGroup;

  users: Array<User> = [];
  // usersFromJson!: Array<User>;
  countries: Array<string> = [];
  @Select(CountriesState.getCountriesList)
  countriesList$!: Observable<Array<string>>;

  openedRowListID: Array<number> = [];
  editableRowListId: Array<number> = [];
  creatableAddress = false;

  get alternativeUsers(): FormArray {
    return this.editForm.get('alternativeUsers') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private usersService: UsersService,
    private countryService: CountryService,
    @Self() private destroy$: NgOnDestroy,
  ) {
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      firstName: '',
      lastName: '',
      username: '',
      phone: '',
      email: ['', Validators.email],
    });

    this.editForm = this.fb.group({
      alternativeUsers: this.fb.array([]),
    });
    this.store.dispatch(new GetAllCountries()).subscribe(() => {
      const countries = this.store.selectSnapshot(CountriesState.getCountriesList);
      if (countries) {
        this.countries = countries;
      }
    });
  }

  alternativeAddress(index: number): FormArray {
    return this.alternativeUsers.controls[index].get('alternateAddresses') as FormArray;
  }

  submit(): void {
    this.store.dispatch(new GetAllUsers()).pipe(
      takeUntil(this.destroy$))
      .subscribe(() => {
        const users = this.store.selectSnapshot(UsersState.getUsers);
        if (users) {
          this.users = this.filterUsers(users);
          this.users = this.users.map((user: User) => ({
            ...user,
            isShowEditAddressRow: 0,
          }));
          this.pushUsersAtEditForm(this.users);
        }
      });

    // this.usersService
    //   .getAllUsers()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((users: Array<User>) => {
    //     this.usersFromJson = users;
    //     Object.keys(this.searchForm.value).forEach(key => {
    //       this.usersFromJson = this.usersFromJson.filter((user: User) => {
    //         if (this.searchForm.value[key] === null) {
    //           return true;
    //         } else {
    //           // @ts-ignore
    //           return user[key].toLowerCase().includes(this.searchForm.value[key].toLowerCase());
    //         }
    //       });
    //     });
    //     this.usersFromJson = this.usersFromJson.map((user: User) => ({
    //       ...user,
    //       isShowEditAddressRow: 0,
    //     }));
    //     this.users = this.usersFromJson;
    //     this.pushUsersAtEditForm(this.users);
    //   });
  }

  filterUsers(users: Array<User>): Array<User> {
    Object.keys(this.searchForm.value).forEach((key) => {
      users = users.filter((user) => {
        if (this.searchForm.value[key] === null) {
          return true;
        } else {
          return user[key].toLowerCase().includes(this.searchForm.value[key].toLowerCase());
        }
      });
    });
    users = users?.map((user: User) => ({
      ...user,
      isShowEditAddressRow: 0,
    }));
    return users;
  }

  reset(): void {
    this.searchForm.reset();
    this.alternativeUsers.clear();
  }

  openTrigger(id: number): void {
    if (this.openedRowListID.includes(id)) {
      const index = this.openedRowListID.findIndex(item => item === id);
      this.openedRowListID.splice(index, 1);
    } else {
      this.openedRowListID.push(id);
    }
  }

  pushUsersAtEditForm(users: Array<User>): void {
    this.alternativeUsers.clear();
    users.forEach(user => {
      this.alternativeUsers.push(
        this.fb.group({
          firstName: [user?.firstName, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
          lastName: [user?.lastName, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
          username: [user?.username, Validators.required],
          phone: [user?.phone, Validators.required],
          email: [user?.email, [Validators.required, Validators.email]],
          alternateAddresses: this.fb.array(this.buildFormGroupAddress(user.alternateAddresses)),
        }),
      );
    });
  }

  buildFormGroupAddress(addresses: Array<Address> | undefined): Array<FormGroup> | Array<any> {
    if (addresses) {
      return addresses.map(address => {
        return this.fb.group({
          typeAddress: [address.typeAddress, Validators.required],
          address: [address.address, Validators.required],
          city: [address.city, Validators.required],
          country: [address.country, Validators.required],
          postCode: [address.postCode, Validators.required],
        });
      });
    } else {
      return [];
    }
  }

  deleteUser(index: number): void {
    const user = this.users[index];
    this.store.dispatch(new RemoveUser(user.id)).pipe(takeUntil(this.destroy$)).subscribe(
      () => {
        this.submit();
      });

    // this.usersService.remove(user.id).subscribe(() => {
    //   this.alternativeUsers.removeAt(index);
    //   this.usersService
    //     .getAllUsers()
    //     .pipe(takeUntil(this.destroy$))
    //     .subscribe((users: Array<User>) => {
    //       this.users = users;
    //     });
    // });
  }

  editUser(id: number): void {
    if (!this.editableRowListId.includes(id)) {
      this.editableRowListId = [...this.editableRowListId, id];
    }
  }

  cancelEditUser(id: number): void {
    if (this.editableRowListId.includes(id)) {
      const index = this.editableRowListId.findIndex(item => item === id);
      this.editableRowListId.splice(index, 1);
      this.alternativeUsers.clear();
      this.submit();
    }
  }

  saveUser(index: number): void {
    const user = this.users[index];
    const copy: User = {
      ...this.alternativeUsers.at(index).value,
      id: user.id,
    };

    // const addresses = copy.alternateAddresses?.map((address: Address, i: number) => ({
    //   ...address,
    //   id: i + 1,
    // }));
    //
    // copy = {
    //   ...copy,
    //   alternateAddresses: addresses,
    // };

    this.store.dispatch(new SaveUsers(copy)).subscribe(() => {
      this.users[index].isShowEditAddressRow = 0;
      this.creatableAddress = false;
      this.cancelEditUser(index);
    });

    // this.usersService
    //   .update(copy)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(() => {
    //     this.cancelEditUser(index);
    //     this.usersService
    //       .getAllUsers()
    //       .pipe(takeUntil(this.destroy$))
    //       .subscribe(users => {
    //         this.users = users.map(person => ({
    //           ...person,
    //           isShowEditAddressRow: 0,
    //         }));
    //         this.creatableAddress = false;
    //       });
    //   });
  }

  deleteAddress(indUser: number, indAddress: number): void {
    this.alternativeAddress(indUser).removeAt(indAddress);
    this.saveUser(indUser);
  }

  addNewAddress(index: number): void {
    const control = this.alternativeUsers.controls[index].get('alternateAddresses') as FormArray;
    control.push(
      this.fb.group({
        typeAddress: [null, Validators.required],
        address: [null, Validators.required],
        city: [null, Validators.required],
        country: [null, Validators.required],
        postCode: [null, Validators.required],
      }),
    );
    this.users[index].isShowEditAddressRow = 1 + this.users[index].alternateAddresses.length;
    this.creatableAddress = true;
  }

  showEditableAddress(indUser: number, indAddress: number): void {
    const user = this.users[indUser];
    if (!(user?.isShowEditAddressRow === indAddress + 1)) {
      user.isShowEditAddressRow = indAddress + 1;
    }
  }

  cancelEditableAddress(indUser: number): void {
    this.users[indUser].isShowEditAddressRow = 0;
    this.creatableAddress = false;
    this.alternativeUsers.clear();
    this.submit();
  }
}
