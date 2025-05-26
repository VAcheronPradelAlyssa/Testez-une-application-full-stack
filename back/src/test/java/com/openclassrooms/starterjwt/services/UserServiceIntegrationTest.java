package com.openclassrooms.starterjwt.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class UserServiceIntegrationTest {

    @InjectMocks
    UserService userService;

    @Mock
    UserRepository userRepository;

    @Test
    public void deleteTest() {
        // GIVEN
        Long userId = 2L;

        // WHEN
        userService.delete(userId);

        // THEN
        verify(userRepository).deleteById(userId);
    }

    @Nested
    public class findByIdTest{

        @Test
        public void shouldFind() {
            // Créer des données de test
            User user1 = new User();
            user1.setId(1L);
            user1.setFirstName("John");
            user1.setLastName("Doe");

            // Définir le comportement du mock
            when(userRepository.findById(1L)).thenReturn(Optional.of(user1));

            // Appeler la méthode à tester
            User result = userService.findById(1L);

            // Vérifier le résultat
            assertEquals(user1, result);
        }

        @Test
        public void shouldNotFound() {
            // Définir le comportement du mock
            when(userRepository.findById(1L)).thenReturn(Optional.empty());

            // Appeler la méthode à tester
            User result = userService.findById(1L);

            // Vérifier le résultat
            assertNull(result);
        }

    }

}