package com.openclassrooms.starterjwt.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;

@ExtendWith(MockitoExtension.class)
public class TeacherServiceIntegrationTest {

    @InjectMocks
    TeacherService teacherService;

    @Mock
    TeacherRepository teacherRepository;


    @Test
    public void findAllTest() {
        // Créer des données de test
        Teacher teacher1 = new Teacher();
        teacher1.setFirstName("John");
        teacher1.setLastName("Doe");

        Teacher teacher2 = new Teacher();
        teacher2.setFirstName("Jane");
        teacher2.setLastName("Doe");

        List<Teacher> teachers = Arrays.asList(teacher1, teacher2);

        // Définir le comportement du mock
        when(teacherRepository.findAll()).thenReturn(teachers);

        // Appeler la méthode à tester
        List<Teacher> result = teacherService.findAll();

        // Vérifier le résultat
        assertEquals(teachers, result);
    }

    @Test
    public void findByIdTest() {
        // Créer des données de test
        Teacher teacher1 = new Teacher();
        teacher1.setId(1L);
        teacher1.setFirstName("John");
        teacher1.setLastName("Doe");

        // Définir le comportement du mock
        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher1));

        // Appeler la méthode à tester
        Teacher result = teacherService.findById(1L);

        // Vérifier le résultat
        assertEquals(teacher1, result);
    }
}