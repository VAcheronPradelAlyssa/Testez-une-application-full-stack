import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TeacherService } from './teacher.service';
import { expect } from '@jest/globals';

describe('TeacherService', () => {
  let service: TeacherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all teachers', () => {
    const mockTeachers = [{ id: 1, firstName: 'John', lastName: 'Doe' }];
    service.all().subscribe(teachers => {
      expect(teachers).toEqual(mockTeachers);
    });
    const req = httpMock.expectOne('api/teacher'); // <-- corriger ici
    expect(req.request.method).toBe('GET');
    req.flush(mockTeachers);
  });

  it('should fetch teacher by id', () => {
    const mockTeacher = { id: 1, firstName: 'John', lastName: 'Doe' };
    service.detail('1').subscribe(teacher => {
      expect(teacher).toEqual(mockTeacher);
    });
    const req = httpMock.expectOne('api/teacher/1'); // <-- corriger ici
    expect(req.request.method).toBe('GET');
    req.flush(mockTeacher);
  });
});