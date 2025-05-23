package com.openclassrooms.starterjwt.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    // Injects the UserRepository Mock into the UserService
    @InjectMocks
    private UserService userService;

    @Test
    void deleteTest() {

        // GIVEN
        Long userId = 1L;

        // WHEN
        userService.delete(userId);

        // THEN
        verify(userRepository, times(1)).deleteById(userId);

    }

    @Test
    void findOneByExistingIdTest() {

        // GIVEN
        Long userId = 1L;
        User mockUser = new User(userId, "john.doe@example.com", "Doe", "John", "A complex password", false, LocalDateTime.now(), LocalDateTime.now());
        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));


        // WHEN
        User result = userService.findById(userId);

        // THEN
        assertThat(result).isEqualTo(mockUser);
        verify(userRepository, times(1)).findById(userId);

    }

    @Test
    void findOneByNonExistingIdTest() {

        // GIVEN
        Long userId = 1L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // WHEN
        User result = userService.findById(userId);

        // THEN
        assertThat(result).isNull();
        verify(userRepository, times(1)).findById(userId);
    }

}