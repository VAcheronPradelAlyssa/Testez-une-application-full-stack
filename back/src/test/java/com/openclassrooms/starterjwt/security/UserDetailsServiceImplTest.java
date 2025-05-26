package com.openclassrooms.starterjwt.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsServiceImpl;

    @Test
    void loadUserByUsernameTest() {

        // GIVEN
        // On crée un utilisateur et on simule le comportement du repo pour retourner cet utilisateur lorsqu'on lui passe un email
        User user = new User(1L, "john.doe@example.com", "Doe", "John", "A simple password", false, LocalDateTime.now(), LocalDateTime.now());
        when(userRepository.findByEmail("john.doe@example.com")).thenReturn(java.util.Optional.of(user));

        // WHEN
        // On appelle la méthode du service pour charger un utilisateur par son nom d'utilisateur (email dans ce cas)
        UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsServiceImpl.loadUserByUsername("john.doe@example.com");

        // THEN
        // On vérifie que les détails de l'utilisateur retournés correspondent à ceux de l'utilisateur créé
        assertThat(userDetails.getUsername()).isEqualTo(user.getEmail());
        assertThat(userDetails.getFirstName()).isEqualTo(user.getFirstName());
        assertThat(userDetails.getLastName()).isEqualTo(user.getLastName());
        assertThat(userDetails.getPassword()).isEqualTo(user.getPassword());

    }

    @Test
    void loadUserByUsernameUserNotFoundTest() {
        // GIVEN
        // On simule le comportement du repo pour ne rien retourner lorsqu'on lui passe un email
        when(userRepository.findByEmail("john.doe@example.com")).thenReturn(java.util.Optional.empty());

        // WHEN / THEN
        // On appelle la méthode du service pour charger un utilisateur par son nom d'utilisateur (email dans ce cas)
        // On s'attend à ce qu'une exception soit levée car aucun utilisateur ne correspond à cet email
        assertThatThrownBy(() -> userDetailsServiceImpl.loadUserByUsername("john.doe@example.com"))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessage("User Not Found with email: john.doe@example.com");
    }

}