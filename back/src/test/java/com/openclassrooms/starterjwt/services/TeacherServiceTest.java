package com.openclassrooms.starterjwt.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class TeacherServiceTest {

    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService teacherService;

    @Test
    void findAllTest() {

        // GIVEN
        List<Teacher> mockTeachers = List.of(
                new Teacher(1L, "Doe", "John", LocalDateTime.now(), LocalDateTime.now()),
                new Teacher(2L, "Lorem", "Ipsum", LocalDateTime.now(), LocalDateTime.now())
        );
        when(teacherRepository.findAll()).thenReturn(mockTeachers);

        // WHEN
        List<Teacher> result = teacherService.findAll();

        // THEN
        assertThat(result).isEqualTo(mockTeachers);
        verify(teacherRepository, times(1)).findAll();

    }

    @Test
    void findOneByExistingIdTest() {

        // GIVEN
        Long teacherId = 1L;
        Teacher mockTeacher = new Teacher(teacherId, "Doe", "John", LocalDateTime.now(), LocalDateTime.now());
        when(teacherRepository.findById(teacherId)).thenReturn(Optional.of(mockTeacher));


        // WHEN
        Teacher result = teacherService.findById(teacherId);

        // THEN
        assertThat(result).isEqualTo(mockTeacher);
        verify(teacherRepository, times(1)).findById(teacherId);

    }

    @Test
    void findOneByNonExistingIdTest() {

        // GIVEN
        Long teacherId = 1L;
        when(teacherRepository.findById(teacherId)).thenReturn(Optional.empty());

        // WHEN
        Teacher result = teacherService.findById(teacherId);

        // THEN
        assertThat(result).isNull();
        verify(teacherRepository, times(1)).findById(teacherId);
    }


}