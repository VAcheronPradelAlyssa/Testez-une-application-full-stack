package com.openclassrooms.starterjwt.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class SessionsServiceTest {
    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionService sessionService;

    private List<Session> mockSessions;

    @BeforeEach
    // On init les données de test avant chaque test
    public void init() {

        List<User> mockUsers = new ArrayList<>();
        mockUsers.add(new User(1L, "john.doe@example.com", "Doe", "John", "A complex password", false, LocalDateTime.now(), LocalDateTime.now()));
        mockUsers.add(new User(2L, "lorem.ipsum@example.com", "Ipsum", "Lorem", "A complex password", true, LocalDateTime.now(), LocalDateTime.now()));

        List<Teacher> mockTeachers = new ArrayList<>();
        mockTeachers.add(new Teacher(1L, "First", "Teacher", LocalDateTime.now(), LocalDateTime.now()));
        mockTeachers.add(new Teacher(2L, "Last", "Teacher", LocalDateTime.now(), LocalDateTime.now()));

        this.mockSessions = new ArrayList<>();
        this.mockSessions.add(new Session(1L, "First session", new Date(), "A small description", mockTeachers.get(0), mockUsers, LocalDateTime.now(), LocalDateTime.now()));
        this.mockSessions.add(new Session(2L, "Second session", new Date(), "A very small description", mockTeachers.get(1), mockUsers, LocalDateTime.now(), LocalDateTime.now()));
    }

    @Test
    void createTest() {

        // GIVEN
        Session session = this.mockSessions.get(0);

        // WHEN
        when(sessionRepository.save(session)).thenReturn(session);
        Session result = sessionService.create(session);

        // THEN
        assertThat(result).isEqualTo(session);
        verify(sessionRepository, times(1)).save(session);

    }

    @Test
    void deleteTest() {

        // GIVEN
        Long sessionId = 1L;

        // WHEN
        sessionService.delete(sessionId);

        // THEN
        verify(sessionRepository, times(1)).deleteById(sessionId);

    }

    @Test
    void findAllTest() {

        // GIVEN
        when(sessionRepository.findAll()).thenReturn(this.mockSessions);

        // WHEN
        List<Session> result = sessionService.findAll();

        // THEN
        assertThat(result).isEqualTo(this.mockSessions);
        verify(sessionRepository, times(1)).findAll();

    }

    @Test
    void getByIdExistingSessionTest() {

        // GIVEN
        Long sessionId = 1L;
        Session mockSession = this.mockSessions.get(0);
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(mockSession));

        // WHEN
        Session result = sessionService.getById(sessionId);

        // THEN
        assertThat(result).isEqualTo(mockSession);
        verify(sessionRepository, times(1)).findById(sessionId);

    }

    @Test
    void getByIdNonExistingSessionTest() {

        // GIVEN
        Long sessionId = 1L;
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());

        // WHEN
        Session result = sessionService.getById(sessionId);

        // THEN
        assertThat(result).isNull();
        verify(sessionRepository, times(1)).findById(sessionId);

    }

    @Test
    void updateTest() {

        // GIVEN
        Long sessionId = 1L;
        String newDescription = "A new small description";
        Session mockedSession = this.mockSessions.get(0);
        Session mockedUpdatedSession = mockedSession.setDescription(newDescription);
        when(sessionRepository.save(mockedUpdatedSession)).thenReturn(mockedUpdatedSession);

        // WHEN
        Session result = sessionService.update(sessionId, mockedUpdatedSession);

        // THEN
        assertThat(result).isEqualTo(mockedUpdatedSession);
        assertThat(result.getId()).isEqualTo(sessionId);
        assertThat(result.getDescription()).isEqualTo(newDescription);
        verify(sessionRepository, times(1)).save(mockedUpdatedSession);

    }

    @Test
    void participateSuccessTest() {

        // GIVEN
        Long sessionId = 1L;
        Long userId = 3L;
        Session mockSession = this.mockSessions.get(0);
        User mockUser = new User(userId, "carl.johnson@mail.com", "Johnson", "Carl", "A simple password", false, LocalDateTime.now(), LocalDateTime.now());

        // On retourne la session mocké
        when(sessionRepository.findById(any(Long.class))).thenReturn(Optional.of(mockSession));
        // On retourne l'utilisateur mocké
        when(userRepository.findById(any(Long.class))).thenReturn(Optional.of(mockUser));
        // A la sauvegarde on retourne la session
        when(sessionRepository.save(mockSession)).thenReturn(mockSession);

        // WHEN
        sessionService.participate(sessionId, userId);

        // THEN
        // On s'assure que l'utilisateur a bien été ajouté à la session
        assertThat(mockSession.getUsers()).contains(mockUser);
        // On s'assure que la méthode save a bien été appelée
        verify(sessionRepository, times(1)).save(mockSession);
    }

    @Test
    void participateSessionNotFoundTest() {
        // GIVEN
        Long sessionId = 1L;
        Long userId = 2L;
        // On simule une session non trouvée
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());

        // On vérifie que la méthode lève bien une NotFoundException et que la méthode save n'est pas appelée
        assertThatThrownBy(() -> sessionService.participate(sessionId, userId))
                .isInstanceOf(NotFoundException.class);
        verify(sessionRepository, times(0)).save(any());
    }

    @Test
    void participateUserNotFoundTest() {
        // GIVEN
        Long sessionId = 1L;
        Long userId = 2L;
        // On simule un utilisateur inexistant
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // On vérifie que la méthode lève bien une NotFoundException et que la méthode save n'est pas appelée
        assertThatThrownBy(() -> sessionService.participate(sessionId, userId))
                .isInstanceOf(NotFoundException.class);
        verify(sessionRepository, times(0)).save(any());
    }

    @Test
    void participateAlreadyParticipatingTest() {
        // GIVEN
        Long sessionId = 1L;
        Long userId = 2L;
        // On récupère la session mocké
        Session mockSession = this.mockSessions.get(0);
        // On récupère un utilisateur sur la session
        User mockUser = this.mockSessions.get(0).getUsers().get(1);
        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(mockSession));

        // On vérifie que la méthode lève bien une BadRequestException car utilisateur déjà présent
        // On vérifie aussi que la méthode save n'est pas appelée
        assertThatThrownBy(() -> sessionService.participate(sessionId, userId))
                .isInstanceOf(BadRequestException.class);
        verify(sessionRepository, times(0)).save(any());
    }

    @Test
    void noLongerParticipateSuccessTest() {
        // GIVEN
        Long sessionId = 1L;
        Long userId = 2L;
        Session mockSession = this.mockSessions.get(0);
        User mockUser = this.mockSessions.get(0).getUsers().get(1);
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(mockSession));

        // WHEN
        sessionService.noLongerParticipate(sessionId, userId);

        // THEN
        // On vérifie que l'utilisateur n'est plus dans la session
        assertThat(mockSession.getUsers()).doesNotContain(mockUser);
        // On vérifie que la méthode save a bien été appelée
        verify(sessionRepository, times(1)).save(mockSession);
    }

    @Test
    void noLongerParticipateSessionNotFoundTest() {
        // GIVEN
        Long sessionId = 1L;
        Long userId = 2L;
        // On simule la désinscription d'un utilisateur d'une session inexistante
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());

        // On vérifie que la méthode lève bien une NotFoundException et que la méthode save n'est pas appelée
        assertThatThrownBy(() -> sessionService.noLongerParticipate(sessionId, userId))
                .isInstanceOf(NotFoundException.class);
        verify(sessionRepository, times(0)).save(any());
    }

    @Test
    void noLongerParticipateNotParticipatingTest() {
        // GIVEN
        Long sessionId = 1L;
        Long userId = 3L;
        Session mockSession = this.mockSessions.get(0);
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(mockSession));

        /*
            * On vérifie que la méthode lève bien une BadRequestException car l'utilisateur n'est pas dans la session
            * et on veut l'en désinscrire
         */
        assertThatThrownBy(() -> sessionService.noLongerParticipate(sessionId, userId))
                .isInstanceOf(BadRequestException.class);
        verify(sessionRepository, times(0)).save(any());
    }

}