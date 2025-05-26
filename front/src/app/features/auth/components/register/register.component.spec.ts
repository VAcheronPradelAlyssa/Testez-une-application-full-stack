import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { expect } from '@jest/globals';

// Ajout des imports Angular Material pour éviter les erreurs NG0304
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(waitForAsync(() => {
    authServiceMock = { register: jest.fn() };
    routerMock = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call register and navigate on success', () => {
    const formValue = {
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123'
    };
    component.form.setValue(formValue);
    authServiceMock.register.mockReturnValue(of(undefined));

    component.submit();

    expect(authServiceMock.register).toHaveBeenCalledWith(formValue);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    expect(component.onError).toBe(false);
  });

  it('should set onError to true on register error', () => {
    const formValue = {
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123'
    };
    component.form.setValue(formValue);
    authServiceMock.register.mockReturnValue(throwError(() => new Error('error')));

    component.submit();

    expect(component.onError).toBe(true);
  });

  it('should have invalid form with missing fields', () => {
    component.form.setValue({ email: '', firstName: '', lastName: '', password: '' });
    expect(component.form.valid).toBe(false);
    expect(component.form.controls.email.hasError('required')).toBe(true);
    expect(component.form.controls.firstName.hasError('required')).toBe(true);
    expect(component.form.controls.lastName.hasError('required')).toBe(true);
    expect(component.form.controls.password.hasError('required')).toBe(true);
  });
});