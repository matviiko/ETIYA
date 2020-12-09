import { Component, OnInit, Self } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../shared/services/users.service';
import { Address, User } from '../shared/interfaces';
import { CountryService } from '../shared/services/country.service';
import { NgOnDestroy } from '../shared/services/ngOnDestroy';
import { takeUntil } from 'rxjs/operators';

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
  usersFromJson!: Array<User>;
  countries: Array<string> = [];

  openedRowListID: Array<number> = [];
  openEditRowListId: Array<number> = [];
  creatableAddress = false;

  get alternativeUsers(): FormArray {
    return this.editForm.get('alternativeUsers') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private countryService: CountryService,
    @Self() private destroy$: NgOnDestroy
  ) {}

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

    this.usersService
      .getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: Array<User>) => {
        this.usersFromJson = users;
      });

    this.countryService
      .getAllCountries()
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.countries = response.map(item => item.name);
      });
  }

  submit(): void {
    let result = this.usersFromJson;
    Object.keys(this.searchForm.value).forEach((key: string) => {
      result = result.filter((user: User) => {
        // @ts-ignore
        return user[key].toLowerCase().includes(this.searchForm.value[key].toLowerCase());
      });
    });
    result = result.map((user: User) => ({
      ...user,
      isShowEditAddressRow: 0,
    }));
    this.users = result;
    this.pushUserAtEditFormUsers(this.users);
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

  pushUserAtEditFormUsers(users: Array<User>): void {
    users.forEach((user, index) => {
      this.alternativeUsers.push(
        this.fb.group({
          firstName: [user?.firstName, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
          lastName: [user?.lastName, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
          username: [user?.username, Validators.required],
          phone: [user?.phone, Validators.required],
          email: [user?.email, [Validators.required, Validators.email]],
          alternateAddresses: this.fb.array([]),
        })
      );
      const control = this.alternativeUsers.controls[index].get('alternateAddresses') as FormArray;

      user.alternateAddresses?.forEach(address => {
        control.push(
          this.fb.group({
            typeAddress: [address.typeAddress, Validators.required],
            address: [address.address, Validators.required],
            city: [address.city, Validators.required],
            country: [address.country, Validators.required],
            postCode: [address.postCode, Validators.required],
          })
        );
      });
    });
  }

  deleteUser(id: number): void {
    this.usersService.remove(id).subscribe(() => {
      this.users = this.users.filter(u => u.id !== id);
    });
  }

  editUser(id: number): void {
    if (!this.openEditRowListId.includes(id)) {
      this.openEditRowListId = [...this.openEditRowListId, id];
    }
  }

  cancelEditUser(id: number): void {
    if (this.openEditRowListId.includes(id)) {
      const index = this.openEditRowListId.findIndex(item => item === id);
      this.openEditRowListId.splice(index, 1);
    }
  }

  saveUser(id: number, index: number): void {
    let user: User = {
      ...this.alternativeUsers.controls[index].value,
      id,
    };

    const addresses = user.alternateAddresses?.map((address: Address, i: number) => ({
      ...address,
      id: i + 1,
    }));

    user = {
      ...user,
      alternateAddresses: addresses,
    };

    this.usersService
      .update(user)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cancelEditUser(id);
        this.usersService
          .getAllUsers()
          .pipe(takeUntil(this.destroy$))
          .subscribe(users => {
            this.users = users.map(person => ({
              ...person,
              isShowEditAddressRow: 0,
            }));
          });
      });
  }

  // cancelEditAddress(idUser: number): void {
  //   const user = this.users.find(u => u.id === idUser);
  //   if (!(user?.isShowEditAddressRow === 0)) {
  //     // @ts-ignore
  //     user.isShowEditAddressRow = 0;
  //   }
  // }

  deleteAddress(idUser: number, idAddress: number): void {
    const user = this.users.find(u => u.id === idUser);
    // @ts-ignore
    let copy: User = { ...user };

    const resultAddresses = copy.alternateAddresses?.filter((address: Address) => address.id !== idAddress);

    delete copy.isShowEditAddressRow;
    copy = { ...copy, alternateAddresses: resultAddresses };

    this.usersService
      .save(copy)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.usersService
          .getAllUsers()
          .pipe(takeUntil(this.destroy$))
          .subscribe(users => {
            this.users = users.map(person => ({
              ...person,
              isShowEditAddressRow: 0,
            }));
          });
      });
  }

  addNewAddress(idUser: number, index: number): void {
    const control = this.alternativeUsers.controls[index].get('alternateAddresses') as FormArray;
    control.push(
      this.fb.group({
        typeAddress: [null, Validators.required],
        address: [null, Validators.required],
        city: [null, Validators.required],
        country: [null, Validators.required],
        postCode: [null, Validators.required],
      })
    );
    const user = this.users.find(u => u.id === idUser);
    // @ts-ignore
    user.alternateAddresses?.push({
      id: index + 2,
      typeAddress: '',
      address: '',
      city: '',
      country: '',
      postCode: '',
    });
    if (!(user?.isShowEditAddressRow === index + 2)) {
      // @ts-ignore
      user.isShowEditAddressRow = index + 2;
    }
    this.creatableAddress = true;
  }

  showEditAddress(idUser: number, idAddress: number): void {
    const user = this.users.find(u => u.id === idUser);
    if (!(user?.isShowEditAddressRow === idAddress)) {
      // @ts-ignore
      user.isShowEditAddressRow = idAddress;
    }
  }
}
