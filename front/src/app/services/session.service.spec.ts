import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';
import { expect } from '@jest/globals';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should emit true after logIn and false after logOut', (done) => {
    const session: SessionInformation = { token: 'jwt-token' } as SessionInformation;

    // On s'abonne à l'observable pour vérifier les changements
    const emitted: boolean[] = [];
    const sub = service.$isLogged().subscribe(val => {
      emitted.push(val);
      // On attend deux valeurs : false (initial), puis true (après logIn), puis false (après logOut)
      if (emitted.length === 3) {
        expect(emitted).toEqual([false, true, false]);
        sub.unsubscribe();
        done();
      }
    });

    service.logIn(session);
    service.logOut();
  });

  it('should set sessionInformation and isLogged on logIn', () => {
    const session: SessionInformation = { token: 'jwt-token' } as SessionInformation;
    service.logIn(session);
    expect(service.sessionInformation).toEqual(session);
    expect(service.isLogged).toBe(true);
  });

  it('should clear sessionInformation and set isLogged to false on logOut', () => {
    const session: SessionInformation = { token: 'jwt-token' } as SessionInformation;
    service.logIn(session);
    service.logOut();
    expect(service.sessionInformation).toBeUndefined();
    expect(service.isLogged).toBe(false);
  });
});