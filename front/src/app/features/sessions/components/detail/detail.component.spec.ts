import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';
import { TeacherService } from '../../../../services/teacher.service';
import { SessionApiService } from '../../services/session-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailComponent } from './detail.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionApiServiceMock: any;
  let teacherServiceMock: any;
  let matSnackBarMock: any;
  let routerMock: any;
  let activatedRouteMock: any;
  let sessionServiceMock: any;

  // Ajout des mocks manquants
  const mockSession = {
    id: 1,
    name: 'Session',
    date: new Date('2025-01-01'),
    teacher_id: 1,
    description: 'desc',
    users: [1, 2]
  };
  const mockTeacher = { id: 1, firstName: 'John', lastName: 'Doe', createdAt: new Date(), updatedAt: new Date() };
  const mockSessionService = {
    sessionInformation: { admin: true, id: 1 }
  };

  beforeEach(async () => {
    sessionApiServiceMock = {
      detail: jest.fn().mockReturnValue(of(mockSession)),
      delete: jest.fn().mockReturnValue(of({})),
      participate: jest.fn().mockReturnValue(of({})),
      unParticipate: jest.fn().mockReturnValue(of({}))
    };
    teacherServiceMock = {
      detail: jest.fn().mockReturnValue(of(mockTeacher))
    };
    matSnackBarMock = { open: jest.fn() };
    routerMock = { navigate: jest.fn() };
    activatedRouteMock = {
      snapshot: { paramMap: { get: jest.fn().mockReturnValue('1') } }
    };
    sessionServiceMock = mockSessionService;

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
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: SessionApiService, useValue: sessionApiServiceMock },
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: MatSnackBar, useValue: matSnackBarMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;

    // Initialisation des données du composant avant detectChanges
    component.session = mockSession;
    component.teacher = mockTeacher;
    component.isAdmin = mockSessionService.sessionInformation.admin;
    component.sessionId = `${mockSession.id}`; 
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch session and teacher on init', () => {
    expect(sessionApiServiceMock.detail).toHaveBeenCalledWith('1');
    expect(component.session).toBeDefined();
    expect(teacherServiceMock.detail).toHaveBeenCalledWith('1');
    expect(component.teacher).toBeDefined();
    expect(component.isParticipate).toBe(true);
  });

  it('should call window.history.back on back()', () => {
    const spy = jest.spyOn(window.history, 'back');
    component.back();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should delete session and navigate', () => {
    component.delete();
    expect(sessionApiServiceMock.delete).toHaveBeenCalledWith('1');
    expect(matSnackBarMock.open).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
    expect(routerMock.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should participate and refresh session', () => {
    component.participate();
    expect(sessionApiServiceMock.participate).toHaveBeenCalledWith('1', '1');
    expect(sessionApiServiceMock.detail).toHaveBeenCalledTimes(2); // une fois au init, une fois après participate
  });

  it('should unParticipate and refresh session', () => {
    component.unParticipate();
    expect(sessionApiServiceMock.unParticipate).toHaveBeenCalledWith('1', '1');
    expect(sessionApiServiceMock.detail).toHaveBeenCalledTimes(2); // une fois au init, une fois après unParticipate
  });
});