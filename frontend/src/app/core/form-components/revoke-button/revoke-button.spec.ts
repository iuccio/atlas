import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevokeButton } from './revoke-button';

describe('RevokeButton', () => {
  let component: RevokeButton;
  let fixture: ComponentFixture<RevokeButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevokeButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevokeButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
