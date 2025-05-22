import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { ListComponent } from './list.component';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { Session } from '../../interfaces/session.interface';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';

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

  it('should render create button when user is admin', () => {
    const createBtn = fixture.debugElement.query(By.css('button[routerLink="create"]'));
    expect(createBtn).toBeTruthy();
  });

it('should render detail and edit buttons for each session when admin', () => {
  const cards = fixture.debugElement.queryAll(By.css('mat-card.item'));
  expect(cards.length).toBe(mockSessions.length);

  cards.forEach(card => {
    const actionButtons = card.queryAll(By.css('mat-card-actions button'));
    expect(actionButtons.length).toBe(2);
    const labels = actionButtons.map(btn => btn.nativeElement.textContent.trim().toLowerCase());
    expect(labels).toContain('searchdetail');
    expect(labels).toContain('editedit');
  });
});


  it('should not render create or edit buttons when user is not admin', () => {
    mockSessionService.sessionInformation = {
      admin: false,
      token: 'mock-token',
      type: 'user',
      id: 2,
      username: 'basicUser',
      firstName: 'Basic',
      lastName: 'User'
    };
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const createBtn = fixture.debugElement.query(By.css('button[routerLink="create"]'));
    expect(createBtn).toBeNull();

    const editBtns = fixture.debugElement.queryAll(By.css('button[routerLink*="update"]'));
    expect(editBtns.length).toBe(0);
  });

  it('should display correct number of session cards', () => {
    const cards = fixture.debugElement.queryAll(By.css('mat-card.item'));
    expect(cards.length).toBe(mockSessions.length);
  });
});
