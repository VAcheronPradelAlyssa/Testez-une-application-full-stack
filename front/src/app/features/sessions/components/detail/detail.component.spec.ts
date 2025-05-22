import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { DetailComponent } from './detail.component';
import { TeacherService } from '../../../../services/teacher.service';
import { SessionApiService } from '../../services/session-api.service';
import { of } from 'rxjs';
import { Session } from '../../interfaces/session.interface';
import { Teacher } from '../../../../interfaces/teacher.interface';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionService: SessionService;
  let sessionApiService: SessionApiService;
  let teacherService: TeacherService;

  const mockSession: Session = {
    id: 1,
    name: 'Session One',
    description: 'Desc One',
    date: new Date(),
    teacher_id: 1,
    users: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockTeacher: Teacher = {
    id: 1,
    lastName: 'Doe',
    firstName: 'John',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  };

  const mockSessionApiService = {
    detail: jest.fn().mockReturnValue(of(mockSession)),
    delete: jest.fn().mockReturnValue(of({})),
    participate: jest.fn().mockReturnValue(of({})),
    unParticipate: jest.fn().mockReturnValue(of({}))
  };

  const mockTeacherService = {
    detail: jest.fn().mockReturnValue(of(mockTeacher))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatSnackBarModule,
        ReactiveFormsModule
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // Utilisez CUSTOM_ELEMENTS_SCHEMA pour ignorer les erreurs liées aux éléments inconnus
    }).compileComponents();

    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService);
    teacherService = TestBed.inject(TeacherService);

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display session information correctly', () => {
    expect(component.session).toEqual(mockSession);
    expect(component.teacher).toEqual(mockTeacher);
  });

  it('should display delete button if user is admin', () => {
    const deleteBtn = fixture.debugElement.nativeElement.querySelector('button[color="warn"]');
    expect(deleteBtn).toBeTruthy();
  });

  it('should not display delete button if user is not admin', () => {
    mockSessionService.sessionInformation.admin = false;
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const deleteBtn = fixture.debugElement.nativeElement.querySelector('button[color="warn"]');
    expect(deleteBtn).toBeNull();
  });

  it('should display participate button if user is not admin and not participating', () => {
    mockSessionService.sessionInformation.admin = false;
    component.isParticipate = false;
    fixture.detectChanges();

    const participateBtn = fixture.debugElement.nativeElement.querySelector('button[color="primary"]');
    expect(participateBtn).toBeTruthy();
    expect(participateBtn.textContent).toContain('Participate');
  });

  it('should display do not participate button if user is not admin and participating', () => {
    mockSessionService.sessionInformation.admin = false;
    component.isParticipate = true;
    fixture.detectChanges();

    const doNotParticipateBtn = fixture.debugElement.nativeElement.querySelector('button[color="warn"]');
    expect(doNotParticipateBtn).toBeTruthy();
    expect(doNotParticipateBtn.textContent).toContain('Do not participate');
  });
});
