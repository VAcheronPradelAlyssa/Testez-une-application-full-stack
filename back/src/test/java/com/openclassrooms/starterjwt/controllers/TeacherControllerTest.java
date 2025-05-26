package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.TeacherDto;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ExtendWith(SpringExtension.class)
@DirtiesContext
@AutoConfigureMockMvc
@Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = "classpath:script.sql")
public class TeacherControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Nested
    public class FindById {

        @Test
        @WithMockUser
        void shouldHaveId() throws Exception {
            mockMvc.perform(get("/api/teacher/1")
                            .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andDo(r -> {
                        String result = r.getResponse().getContentAsString();
                        TeacherDto teacher = objectMapper.readValue(result, TeacherDto.class);
                        assertNotNull(teacher);
                        assertEquals("Margot", teacher.getFirstName());
                    });
        }

        @Test
        @WithMockUser
        void shouldNotFound() throws Exception {

            // WHEN & THEN
            mockMvc.perform(get("/api/teacher/99")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isNotFound());

        }
        @Test
        @WithMockUser
        void shouldBadRequest() throws Exception {

            // WHEN & THEN
            mockMvc.perform(get("/api/teacher/not_a_number")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isBadRequest());

        }

    }
    @Test
    @WithMockUser
    void findAllTest() throws Exception {
        mockMvc.perform(get("/api/teacher")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andDo(r -> {
                String result = r.getResponse().getContentAsString();
                List<TeacherDto> teachers = objectMapper.readValue(result, new TypeReference<List<TeacherDto>>() {});
                assertNotNull(teachers);
                assertEquals(2, teachers.size());
            });
        }
}