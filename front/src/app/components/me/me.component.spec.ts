import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MeComponent } from './me.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import { expect } from '@jest/globals';

// Ajoute les modules Angular Material nécessaires
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let routerMock: any;
  let sessionServiceMock: any;
  let matSnackBarMock: any;
  let userServiceMock: any;

  beforeEach(waitForAsync(() => {
    routerMock = { navigate: jest.fn() };
    sessionServiceMock = {
      sessionInformation: { id: 1 },
      logOut: jest.fn()
    };
    matSnackBarMock = { open: jest.fn() };
    userServiceMock = {
      getById: jest.fn().mockReturnValue(of({ id: 1, email: '', firstName: '', lastName: '' })), // mock par défaut
      delete: jest.fn()
    };

    TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [MatCardModule, MatIconModule],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: MatSnackBar, useValue: matSnackBarMock },
        { provide: UserService, useValue: userServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user on ngOnInit', () => {
    const mockUser: User = { id: 1, email: 'test@test.com', firstName: 'A', lastName: 'B' } as User;
    userServiceMock.getById.mockReturnValue(of(mockUser));
    component.ngOnInit();
    expect(userServiceMock.getById).toHaveBeenCalledWith('1');
    expect(component.user).toEqual(mockUser);
  });

  it('should call window.history.back on back()', () => {
    const spy = jest.spyOn(window.history, 'back');
    component.back();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should delete user, show snackbar, logout and navigate', () => {
    userServiceMock.delete.mockReturnValue(of(undefined));
    component.delete();
    expect(userServiceMock.delete).toHaveBeenCalledWith('1');
    expect(matSnackBarMock.open).toHaveBeenCalledWith("Your account has been deleted !", 'Close', { duration: 3000 });
    expect(sessionServiceMock.logOut).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});