import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { of } from 'rxjs';

import { ListComponent } from './list.component';
import { SessionApiService } from '../../services/session-api.service';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientModule, MatCardModule, MatIconModule],
      providers: [{ provide: SessionService, useValue: mockSessionService }]
    })
      .compileComponents();

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
});