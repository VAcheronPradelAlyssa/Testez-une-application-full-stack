import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SessionApiService } from './session-api.service';
import { Session } from '../interfaces/session.interface';
import { expect } from '@jest/globals';

describe('SessionApiService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all sessions', () => {
    const mockSessions: Session[] = [{ id: 1, name: 'Session', date: new Date('2025-01-01'), teacher_id: 1, description: 'desc', users: [] }];
    service.all().subscribe(sessions => {
      expect(sessions).toEqual(mockSessions);
    });
    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('GET');
    req.flush(mockSessions);
  });

  it('should fetch session by id', () => {
    const mockSession: Session = { id: 1, name: 'Session', date: new Date('2025-01-01'), teacher_id: 1, description: 'desc', users: [] };
    service.detail('1').subscribe(session => {
      expect(session).toEqual(mockSession);
    });
    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockSession);
  });

  it('should delete session by id', () => {
    service.delete('1').subscribe(response => {
      expect(response).toEqual({});
    });
    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should create a session', () => {
    const newSession: Session = { id: 2, name: 'New', date: new Date('2025-02-01'), teacher_id: 2, description: 'desc', users: [] };
    service.create(newSession).subscribe(session => {
      expect(session).toEqual(newSession);
    });
    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newSession);
    req.flush(newSession);
  });

  it('should update a session', () => {
    const updatedSession: Session = { id: 1, name: 'Updated', date: new Date('2025-01-01'), teacher_id: 1, description: 'desc', users: [] };
    service.update('1', updatedSession).subscribe(session => {
      expect(session).toEqual(updatedSession);
    });
    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedSession);
    req.flush(updatedSession);
  });

  it('should participate to a session', () => {
    service.participate('1', '10').subscribe(response => {
      expect(response).toBeUndefined();
    });
    const req = httpMock.expectOne('api/session/1/participate/10');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeNull();
    req.flush(null);
  });

  it('should unParticipate from a session', () => {
    service.unParticipate('1', '10').subscribe(response => {
      expect(response).toBeUndefined();
    });
    const req = httpMock.expectOne('api/session/1/participate/10');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});