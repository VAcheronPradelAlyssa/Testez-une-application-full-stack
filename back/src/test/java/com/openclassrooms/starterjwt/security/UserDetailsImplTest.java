package com.openclassrooms.starterjwt.security;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Collection;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.security.core.GrantedAuthority;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class UserDetailsImplTest {
    @Mock
    private UserDetailsImpl userDetails;

    @BeforeEach
    void init() {
        userDetails = UserDetailsImpl.builder()
                .id(1L)
                .username("john.doe@example.com")
                .firstName("John")
                .lastName("Doe")
                .admin(false)
                .password("A simple password")
                .build();
    }

    @Test
    void testGetAuthorities() {
        // WHEN
        // On appelle la méthode getAuthorities() de l'objet userDetails
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();

        // THEN
        // On vérifie que la collection retournée n'est pas nulle et est vide
        assertThat(authorities).isNotNull().isEmpty();
    }

    @Test
    void testIsAccountNonExpired() {
        // THEN
        // On vérifie que la méthode isAccountNonExpired() retourne true
        assertThat(userDetails.isAccountNonExpired()).isTrue();
    }

    @Test
    void testIsAccountNonLocked() {
        // THEN
        // On vérifie que la méthode isAccountNonLocked() retourne true
        assertThat(userDetails.isAccountNonLocked()).isTrue();
    }

    @Test
    void testIsCredentialsNonExpired() {
        // THEN
        // On vérifie que la méthode isCredentialsNonExpired() retourne true
        assertThat(userDetails.isCredentialsNonExpired()).isTrue();
    }

    @Test
    void testIsEnabled() {
        // THEN
        // On vérifie que la méthode isEnabled() retourne true
        assertThat(userDetails.isEnabled()).isTrue();
    }

    @Test
    void testEqualsSameObject() {
        // GIVEN
        // On crée une référence à l'objet userDetails
        UserDetailsImpl sameUserDetails = userDetails;

        // THEN
        // On vérifie que l'objet userDetails est égal à lui-même
        assertThat(userDetails.equals(sameUserDetails)).isTrue();
    }

    @Test
    void testEqualsDifferentClass() {
        // GIVEN
        // On crée un nouvel objet de classe différente
        Object differentObject = new Object();

        // THEN
        // On vérifie que l'objet userDetails n'est pas égal à un objet d'une classe différente
        assertThat(userDetails.equals(differentObject)).isFalse();
    }

    @Test
    void testEqualsDifferentId() {
        // GIVEN
        // On crée un nouvel objet UserDetailsImpl avec un identifiant différent
        UserDetailsImpl differentUserDetails = UserDetailsImpl.builder().id(2L).build();

        // THEN
        // On vérifie que l'objet userDetails n'est pas égal à un objet avec un identifiant différent
        assertThat(userDetails.equals(differentUserDetails)).isFalse();
    }

    @Test
    void testEqualsSameId() {
        // GIVEN
        // On crée un nouvel objet UserDetailsImpl avec le même identifiant
        UserDetailsImpl sameIdUserDetails = UserDetailsImpl.builder().id(1L).build();

        // THEN
        // On vérifie que l'objet userDetails est égal à un objet avec le même identifiant
        assertThat(userDetails.equals(sameIdUserDetails)).isTrue();
    }

}