package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import com.openclassrooms.starterjwt.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ExtendWith(SpringExtension.class)
@DirtiesContext
@AutoConfigureMockMvc
@Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = "classpath:script.sql")
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TestRestTemplate restTemplate;

    @Nested
    public class FindById {

        @Test
        @WithMockUser
        void shouldHaveId() throws Exception {

            mockMvc.perform(get("/api/user/1")
                            .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andDo(r -> {
                        String result = r.getResponse().getContentAsString();
                        TeacherDto teacher = objectMapper.readValue(result, TeacherDto.class);
                        assertNotNull(teacher);
                        assertEquals("Admin", teacher.getFirstName());
                    });
        }

        @Test
        @WithMockUser
        void shouldNotFound() throws Exception {
            mockMvc.perform(get("/api/user/99")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isNotFound());
        }
        @Test
        @WithMockUser
        void shouldBadRequest() throws Exception {
            mockMvc.perform(get("/api/user/not_a_number")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
        }
    }

    @Nested
    public class Save{

        @BeforeEach
        void setUp() {
            LoginRequest loginRequest = new LoginRequest();
            loginRequest.setEmail("gym@studio.com");
            loginRequest.setPassword("Mypassword8$");
            restTemplate.postForEntity("/api/auth/login", loginRequest, JwtResponse.class);
        }

        @Test
        void shouldDelete() throws Exception {
            mockMvc.perform(delete("/api/user/2")
                            .with(SecurityMockMvcRequestPostProcessors.user("gym@studio.com"))
                            .with(SecurityMockMvcRequestPostProcessors.csrf()))
                    .andExpect(status().isOk());
        }

        @Test
        void shouldNotFound() throws Exception {
            mockMvc.perform(delete("/api/user/99")
                            .with(SecurityMockMvcRequestPostProcessors.user("gym@studio.com"))
                            .with(SecurityMockMvcRequestPostProcessors.csrf()))
                    .andExpect(status().isNotFound());
        }
        @Test
        void shouldUnauthorized() throws Exception {
            mockMvc.perform(delete("/api/user/1")
                            .with(SecurityMockMvcRequestPostProcessors.user("gym@studio.com"))
                            .with(SecurityMockMvcRequestPostProcessors.csrf()))
                    .andExpect(status().isUnauthorized());
        }
        void shouldBadRequest() throws Exception {
            mockMvc.perform(delete("/api/user/2")
                            .with(SecurityMockMvcRequestPostProcessors.user("gym@studio.com"))
                            .with(SecurityMockMvcRequestPostProcessors.csrf()))
                    .andExpect(status().isBadRequest());
        }
    }

}