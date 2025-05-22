import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { expect } from '@jest/globals';

import { LoginComponent } from './login.component';
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  // Mocks pour les services
  let authServiceMock: Partial<AuthService>;
  let sessionServiceMock: Partial<SessionService>;
  let routerMock: Partial<Router>;

  beforeEach(waitForAsync(() => {
    authServiceMock = {
      login: jest.fn()
    };
    sessionServiceMock = {
      logIn: jest.fn()
    };
    routerMock = {
      navigate: jest.fn()
    };

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: SessionService, useValue: sessionServiceMock }
      ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    // Inject router mock manuellement (car non dans providers)
    component['router'] = routerMock as Router;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login and navigate on success with real credentials', () => {
    const loginData = { email: 'yoga@studio.com', password: 'test!1234' };
    component.form.setValue(loginData);

    const fakeResponse = { token: 'jwt-token', id: 1, username: 'yoga@studio.com', firstName: 'Admin', lastName: 'Admin', isAdmin: true };
    (authServiceMock.login as jest.Mock).mockReturnValue(of(fakeResponse));

    component.submit();

    expect(authServiceMock.login).toHaveBeenCalledWith(loginData);
    expect(sessionServiceMock.logIn).toHaveBeenCalledWith(fakeResponse);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/sessions']);
    expect(component.onError).toBe(false);
  });

  it('should set onError to true on login failure', () => {
    const loginData = { email: 'wrong@example.com', password: 'badpass' };
    component.form.setValue(loginData);

    (authServiceMock.login as jest.Mock).mockReturnValue(throwError(() => new Error('Unauthorized')));

    component.submit();

    expect(component.onError).toBe(true);
  });

  it('should invalidate form with missing or invalid fields', () => {
    // Email required
    component.form.setValue({ email: '', password: '123456' });
    expect(component.form.valid).toBe(false);
    expect(component.form.controls.email.hasError('required')).toBe(true);

    // Email invalid
    component.form.setValue({ email: 'invalid-email', password: '123456' });
    expect(component.form.valid).toBe(false);
    expect(component.form.controls.email.hasError('email')).toBe(true);

    // Password required
    component.form.setValue({ email: 'test@example.com', password: '' });
    expect(component.form.valid).toBe(false);
    expect(component.form.controls.password.hasError('required')).toBe(true);

    // Password min value (Validators.min(3) attend un nombre >= 3)
    component.form.setValue({ email: 'test@example.com', password: '2' });
    expect(component.form.valid).toBe(false);
    expect(component.form.controls.password.hasError('min')).toBe(true);

    component.form.setValue({ email: 'test@example.com', password: '3' });
    expect(component.form.controls.password.hasError('min')).toBe(false);
  });

  it('should display error message on login failure', () => {
    component.form.setValue({ email: 'wrong@example.com', password: 'badpass' });
    (authServiceMock.login as jest.Mock).mockReturnValue(throwError(() => new Error('Unauthorized')));

    component.submit();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.error')?.textContent).toContain('An error occurred');
  });

  it('should disable submit button when form is invalid', () => {
    component.form.setValue({ email: '', password: '' });
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(true);
  });

  it('should enable submit button when form is valid', () => {
    component.form.setValue({ email: 'yoga@studio.com', password: 'test!1234' });
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(false);
  });
  it('should toggle password visibility', () => {
  component.hide = true;
  fixture.detectChanges();

  const toggleButton = fixture.nativeElement.querySelector('button[mat-icon-button]');
  const passwordInput = fixture.nativeElement.querySelector('input[type="password"]');

  expect(passwordInput).toBeTruthy();
  expect(toggleButton.textContent).toContain('visibility_off');

  toggleButton.click();
  fixture.detectChanges();

  const textInput = fixture.nativeElement.querySelector('input[type="text"]');
  expect(textInput).toBeTruthy();
  expect(toggleButton.textContent).toContain('visibility');
});

  it('should navigate to /sessions after successful login', () => {
  const loginData = { email: 'yoga@studio.com', password: 'test!1234' };
  component.form.setValue(loginData);

  const fakeResponse = { token: 'jwt-token', id: 1, username: 'yoga@studio.com', firstName: 'Admin', lastName: 'Admin', isAdmin: true };
  (authServiceMock.login as jest.Mock).mockReturnValue(of(fakeResponse));

  component.submit();

  expect(routerMock.navigate).toHaveBeenCalledWith(['/sessions']);
});
it('should initialize the form with default values', () => {
  expect(component.form.value).toEqual({ email: '', password: '' });
  expect(component.form.controls.email.valid).toBe(false);
  expect(component.form.controls.password.valid).toBe(false);
});

});
