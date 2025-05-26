import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { SessionService } from './services/session.service';
import { AuthService } from './features/auth/services/auth.service';
import { expect } from '@jest/globals';

describe('AppComponent', () => {
  let sessionServiceMock: any;
  let authServiceMock: any;
  let router: Router;

  beforeEach(async () => {
    sessionServiceMock = {
      $isLogged: jest.fn().mockReturnValue(of(true)),
      logOut: jest.fn()
    };

    authServiceMock = {};

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatToolbarModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: { navigate: jest.fn() } }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should call sessionService.$isLogged when $isLogged is called', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.$isLogged();
    expect(sessionServiceMock.$isLogged).toHaveBeenCalled();
  });

  it('should log out the user and navigate to home', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.logout();
    expect(sessionServiceMock.logOut).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });



});