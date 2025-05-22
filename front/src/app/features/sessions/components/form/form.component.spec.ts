import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FormComponent } from './form.component';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from '../../../../services/teacher.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let sessionServiceMock: any;
  let sessionApiServiceMock: any;
  let teacherServiceMock: any;
  let router: Router;

  beforeEach(async () => {
    sessionServiceMock = {
      sessionInformation: { admin: true }
    };

    sessionApiServiceMock = {
      create: jest.fn().mockReturnValue(of({})),
      update: jest.fn().mockReturnValue(of({})),
      detail: jest.fn().mockReturnValue(of({
        id: '1',
        name: 'Existing session',
        date: '2025-06-01',
        teacher_id: '1',
        description: 'Existing description'
      }))
    };

    teacherServiceMock = {
      all: jest.fn().mockReturnValue(of([
        { id: '1', firstName: 'Alice', lastName: 'Smith' },
        { id: '2', firstName: 'Bob', lastName: 'Brown' }
      ]))
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatSnackBarModule,
        NoopAnimationsModule, // Utilisez NoopAnimationsModule pour désactiver les animations
        MatIconModule,
        RouterTestingModule.withRoutes([{ path: 'sessions/create', component: FormComponent }])
      ],
      declarations: [FormComponent],
      providers: [
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: SessionApiService, useValue: sessionApiServiceMock },
        { provide: TeacherService, useValue: teacherServiceMock },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } }
        },
        {
          provide: Router,
          useValue: { navigate: jest.fn(), url: '/sessions/create' }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait invalider sessionForm si champs requis manquants', () => {
    component.sessionForm!.patchValue({ name: '', date: '', teacher_id: '', description: '' });
    expect(component.sessionForm!.valid).toBe(false);
  });

  it('devrait appeler create() quand sessionForm est valide et onUpdate=false', () => {
    component.onUpdate = false;
    component.sessionForm!.patchValue({
      name: 'Nouvelle',
      date: '2025-06-01',
      teacher_id: '1',
      description: 'Desc'
    });
    component.submit();
    expect(sessionApiServiceMock.create).toHaveBeenCalledWith({
      name: 'Nouvelle',
      date: '2025-06-01',
      teacher_id: '1',
      description: 'Desc'
    });
  });
});