import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormComponent } from './form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { SessionApiService } from '../../services/session-api.service';
import { SessionService } from '../../../../services/session.service';
import { TeacherService } from '../../../../services/teacher.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let sessionApiServiceMock: any;
  let sessionServiceMock: any;
  let teacherServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;
  let matSnackBarMock: any;

  beforeEach(async () => {
    sessionApiServiceMock = {
      create: jest.fn().mockReturnValue(of({})),
      update: jest.fn().mockReturnValue(of({})),
      detail: jest.fn().mockReturnValue(of({
        name: 'Session',
        date: '2025-01-01',
        teacher_id: 1,
        description: 'desc'
      }))
    };

    sessionServiceMock = {
      sessionInformation: { admin: true }
    };

    teacherServiceMock = {
      all: jest.fn().mockReturnValue(of([
        { id: 1, firstName: 'John', lastName: 'Doe' }
      ]))
    };

    routerMock = { url: '', navigate: jest.fn() };

    activatedRouteMock = {
      snapshot: { paramMap: { get: jest.fn().mockReturnValue('1') } }
    };

    matSnackBarMock = { open: jest.fn() };

    await TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatSnackBarModule,
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        BrowserAnimationsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: SessionApiService, useValue: sessionApiServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: MatSnackBar, useValue: matSnackBarMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.sessionForm?.valid).toBe(false);
  });

  it('should have valid form when all fields are filled', () => {
    component.sessionForm?.setValue({
      name: 'Test',
      date: '2025-01-01',
      teacher_id: 1,
      description: 'desc'
    });
    expect(component.sessionForm?.valid).toBe(true);
  });

  it('should call sessionApiService.create on submit for new session', () => {
    component.onUpdate = false;
    component.sessionForm?.setValue({
      name: 'Test',
      date: '2025-01-01',
      teacher_id: 1,
      description: 'desc'
    });
    component.submit();
    expect(sessionApiServiceMock.create).toHaveBeenCalledWith({
      name: 'Test',
      date: '2025-01-01',
      teacher_id: 1,
      description: 'desc'
    });
  });

  it('should call sessionApiService.update on submit for existing session', () => {
    component.onUpdate = true;
    (component as any).id = '1';
    component.sessionForm?.setValue({
      name: 'Test',
      date: '2025-01-01',
      teacher_id: 1,
      description: 'desc'
    });
    component.submit();
    expect(sessionApiServiceMock.update).toHaveBeenCalledWith('1', {
      name: 'Test',
      date: '2025-01-01',
      teacher_id: 1,
      description: 'desc'
    });
  });

  it('should redirect if not admin', () => {
    sessionServiceMock.sessionInformation.admin = false;
    component.ngOnInit();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should initialize form with session data in update mode', () => {
    component.onUpdate = false;
    routerMock.url = '/sessions/update/1';
    component.ngOnInit();
    expect(component.sessionForm?.value).toEqual({
      name: 'Session',
      date: '2025-01-01',
      teacher_id: 1,
      description: 'desc'
    });
  });
});