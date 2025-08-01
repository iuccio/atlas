import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelectComponent } from './user-select.component';
import { UserService } from '../../service/user.service';
import { of } from 'rxjs';
import { Component, Input } from '@angular/core';
import { ApplicationType } from '../../../../api';
import { TranslatePipe } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { SearchSelectComponent } from '../../../../core/form-components/search-select/search-select.component';

@Component({
  selector: 'form-search-select',
  template: '<p>form-search-select</p>',
})
class MockFormSearchSelectComponent {
  @Input() items$ = of([]);
  @Input() formGroup = undefined;
  @Input() controlName = '';
  @Input() getSelectOption = undefined;
}

describe('UserSelectComponent', () => {
  let component: UserSelectComponent;
  let fixture: ComponentFixture<UserSelectComponent>;

  const userServiceSpy = jasmine.createSpyObj('UserService', [
    'searchUsers',
    'searchUsersInAtlas',
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSelectComponent],
      providers: [
        TranslatePipe,
        { provide: UserService, useValue: userServiceSpy },
      ],
    })
      .overrideComponent(UserSelectComponent, {
        remove: { imports: [SearchSelectComponent] },
        add: { imports: [MockFormSearchSelectComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(UserSelectComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test searchUser', (done) => {
    userServiceSpy.searchUsers.and.returnValue(
      of([
        {
          sbbUserId: 'u236171',
        },
      ])
    );
    component.searchUser('testQuery');
    component.searchInAtlas = false;
    fixture.detectChanges();
    expect(userServiceSpy.searchUsers).toHaveBeenCalledOnceWith('testQuery');
    component.userSearchResults$.subscribe((val) => {
      expect(val).toEqual([
        {
          sbbUserId: 'u236171',
        },
      ]);
      done();
    });
  });

  it('test searchUser in atlas', (done) => {
    userServiceSpy.searchUsersInAtlas.and.returnValue(
      of([
        {
          sbbUserId: 'u236171',
        },
      ])
    );
    component.searchInAtlas = true;
    component.applicationType = ApplicationType.Sepodi;
    fixture.detectChanges();
    component.searchUserInAtlas('testQuery');
    expect(userServiceSpy.searchUsersInAtlas).toHaveBeenCalledOnceWith(
      'testQuery',
      ApplicationType.Sepodi
    );
    component.userSearchResults$.subscribe((val) => {
      expect(val).toEqual([
        {
          sbbUserId: 'u236171',
        },
      ]);
      done();
    });
  });
});
