import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { expect } from '@jest/globals';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  let authServiceMock: Partial<AuthService>;
  let routerMock: Partial<Router>;

  beforeEach(waitForAsync(() => {
    authServiceMock = {
      register: jest.fn()
    };
    routerMock = {
      navigate: jest.fn()
    };

    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form if required fields are empty', () => {
    component.form.setValue({
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    });
    expect(component.form.valid).toBe(false);
    expect(component.form.controls.firstName.hasError('required')).toBe(true);
    expect(component.form.controls.lastName.hasError('required')).toBe(true);
    expect(component.form.controls.email.hasError('required')).toBe(true);
    expect(component.form.controls.password.hasError('required')).toBe(true);
  });

  it('should validate email format', () => {
    component.form.controls.email.setValue('not-an-email');
    expect(component.form.controls.email.hasError('email')).toBe(true);

    component.form.controls.email.setValue('user@example.com');
    expect(component.form.controls.email.hasError('email')).toBe(false);
  });

  it('should disable submit button if form is invalid', () => {
    component.form.setValue({
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    });
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(true);
  });

  it('should enable submit button if form is valid', () => {
    component.form.setValue({
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      password: 'securePassword'
    });
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(false);
  });

  it('should call authService.register with form data on submit', () => {
    const formData = {
      firstName: 'Alice',
      lastName: 'Dupont',
      email: 'alice@example.com',
      password: '123456'
    };
    component.form.setValue(formData);
    (authServiceMock.register as jest.Mock).mockReturnValue(of(void 0));

    component.submit();

    expect(authServiceMock.register).toHaveBeenCalledWith(formData);
  });

  it('should navigate to /login on successful registration', () => {
    component.form.setValue({
      firstName: 'Alice',
      lastName: 'Dupont',
      email: 'alice@example.com',
      password: '123456'
    });
    (authServiceMock.register as jest.Mock).mockReturnValue(of(void 0));

    component.submit();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    expect(component.onError).toBe(false);
  });

  it('should set onError to true on registration failure', () => {
    component.form.setValue({
      firstName: 'Alice',
      lastName: 'Dupont',
      email: 'alice@example.com',
      password: '123456'
    });
    (authServiceMock.register as jest.Mock).mockReturnValue(throwError(() => new Error('Registration failed')));

    component.submit();

    expect(component.onError).toBe(true);
  });

  it('should display error message when onError is true', () => {
    component.onError = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.error')?.textContent).toContain('An error occurred');
  });
});
