import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Session } from '../../interfaces/session.interface';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { of } from 'rxjs';

import { ListComponent } from './list.component';
import { SessionApiService } from '../../services/session-api.service';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  // Mocks
  const mockSessions: Session[] = [
    {
      id: 1,
      name: 'Session One',
      description: 'Desc One',
      date: new Date(),
      teacher_id: 1,
      users: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'Session Two',
      description: 'Desc Two',
      date: new Date(),
      teacher_id: 2,
      users: [1, 2],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  let mockSessionService: Partial<SessionService>;
  let mockSessionApiService: Partial<SessionApiService>;

  beforeEach(waitForAsync(() => {
    mockSessionService = {
      sessionInformation: {
        admin: true,
        token: 'mock-token',
        type: 'admin',
        id: 1,
        username: 'adminUser',
        firstName: 'Admin',
        lastName: 'User'
      }
    };

    mockSessionApiService = {
      all: jest.fn().mockReturnValue(of(mockSessions))
    };

    TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        RouterTestingModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return sessionInformation from sessionService with user getter', () => {
    expect(component.user).toBe(mockSessionService.sessionInformation);
  });

  it('should initialize sessions$ with sessionApiService.all()', (done) => {
    const mockSessions = [{ id: 1 } as any];
    const mockSessionApiService = TestBed.inject(SessionApiService);
    jest.spyOn(mockSessionApiService, 'all').mockReturnValue(of(mockSessions));
    // Création d'un nouveau composant pour prendre en compte le nouveau mock
    const newFixture = TestBed.createComponent(ListComponent);
    const newComponent = newFixture.componentInstance;
    newComponent.sessions$.subscribe(sessions => {
      expect(sessions).toEqual(mockSessions);
      done();
    });
  });

  it('should show Create and Edit buttons for admin', () => {
    // On modifie le mock pour simuler un admin
    const sessionService = TestBed.inject(SessionService);
    sessionService.sessionInformation = { admin: true } as any;
    // On crée un nouveau composant pour prendre en compte la modif
    const adminFixture = TestBed.createComponent(ListComponent);
    adminFixture.detectChanges();
    const compiled = adminFixture.nativeElement as HTMLElement;
    // Le bouton Create a routerLink="create" (pas "/sessions/create")
    expect(compiled.querySelector('button[routerLink="create"]')).toBeTruthy();
    // Le bouton Edit a [routerLink]="['update',session.id]" donc on cherche tous les boutons avec 'update'
    expect(compiled.querySelector('button[ng-reflect-router-link^="update"]')).toBeTruthy();
  });

  it('should not show Create and Edit buttons for non-admin', () => {
    // On modifie le mock pour simuler un non-admin
    const sessionService = TestBed.inject(SessionService);
    sessionService.sessionInformation = { admin: false } as any;
    // On crée un nouveau composant pour prendre en compte la modif
    const userFixture = TestBed.createComponent(ListComponent);
    userFixture.detectChanges();
    const compiled = userFixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button[routerLink="create"]')).toBeFalsy();
    expect(compiled.querySelector('button[ng-reflect-router-link^="update"]')).toBeFalsy();
  });
});