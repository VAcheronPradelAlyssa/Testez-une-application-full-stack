import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { expect } from '@jest/globals';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    (window as any).expect(service).toBeTruthy();
  });

  it('should call login API', () => {
    const mockRequest = { email: 'test@test.com', password: 'password' };
    const mockResponse = { token: 'jwt-token' };

    service.login(mockRequest as any).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should call register API', () => {
    const mockRequest = { email: 'test@test.com', password: 'password', firstName: 'A', lastName: 'B' };

    service.register(mockRequest as any).subscribe(res => {
      expect(res).toBeUndefined();
    });

    const req = httpMock.expectOne('api/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });
});