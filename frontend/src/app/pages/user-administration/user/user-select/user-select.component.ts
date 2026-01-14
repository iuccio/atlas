import {
  Component,
  EventEmitter,
  input,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ApplicationType, User } from '../../../../api';
import { SearchSelectComponent } from '../../../../core/form-components/search-select/search-select.component';
import { UserSelectFormatPipe } from './user-select-format.pipe';
import { UserAdministrationService } from '../../../../api/service/user-administration/user-administration.service';

export type SearchMode = 'default' | 'inAtlas' | 'boDossierAnsweringUsers';

@Component({
  selector: 'atlas-user-select',
  templateUrl: './user-select.component.html',
  imports: [SearchSelectComponent, ReactiveFormsModule, UserSelectFormatPipe],
})
export class UserSelectComponent implements OnInit {
  constructor(private readonly userService: UserAdministrationService) {}

  @Input() form!: FormGroup;
  @Input() applicationType?: ApplicationType;

  searchMode = input<SearchMode>('default');
  controlName = input<string>('userSearch');
  bindValue = input<string>('');

  @Output() selectionChange: EventEmitter<User> = new EventEmitter<User>();
  userSearchResults$: Observable<User[]> = of([]);

  ngOnInit() {
    const initialValue = this.form.controls[this.controlName()]?.value;
    this.search(initialValue);
  }

  search(searchQuery: string): void {
    if (!searchQuery) {
      return;
    }
    switch (this.searchMode()) {
      case 'default':
        this.userSearchResults$ = this.userService.searchUsers(searchQuery);
        break;
      case 'inAtlas':
        this.userSearchResults$ = this.userService.searchUsersInAtlas(
          searchQuery,
          this.applicationType!
        );
        break;
      case 'boDossierAnsweringUsers':
        this.userSearchResults$ =
          this.userService.searchBoDossierAnsweringUsers(searchQuery);
        break;
    }
  }
}
