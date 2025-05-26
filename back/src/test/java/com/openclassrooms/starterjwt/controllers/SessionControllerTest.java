package com.openclassrooms.starterjwt.controllers;


import java.time.LocalDateTime;
import java.util.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.MediaType;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.jdbc.Sql;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ExtendWith(SpringExtension.class)
@DirtiesContext
@AutoConfigureMockMvc
@Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = "classpath:script.sql")
class SessionControllerTest {

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
        void shouldFind() throws Exception {

            mockMvc.perform(get("/api/session/1")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andDo(r -> {
                        String result = r.getResponse().getContentAsString();
                        SessionDto session = objectMapper.readValue(result, SessionDto.class);
                        assertNotNull(session);
                        assertEquals(1, session.getId());
                    });

        }

        @Test
        @WithMockUser
        void shouldNotFound() throws Exception {
            mockMvc.perform(get("/api/session/12")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isNotFound());
        }

        @Test
        @WithMockUser
        void shouldBadRequest() throws Exception {
            mockMvc.perform(get("/api/session/not_a_number")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isBadRequest());
        }

    }


    @Test
    @WithMockUser
    void findAllTest() throws Exception {
        mockMvc.perform(get("/api/session")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(r -> {
                    String result = r.getResponse().getContentAsString();
                    List<SessionDto> sessions = List.of(objectMapper.readValue(result, SessionDto[].class));
                    assertNotNull(sessions);
                    assertEquals(2, sessions.size());
                });
    }

    @Test
    @WithMockUser
    void createTest() throws Exception {

        SessionDto session = new SessionDto();
        session.setName("New session");
        session.setDescription("A small description");
        session.setTeacher_id(1L);
        session.setDate(new Date());

        mockMvc.perform(post("/api/session")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(session)))
                .andExpect(status().isOk())
                .andDo(r -> {
                    String result = r.getResponse().getContentAsString();
                    SessionDto outputSession = objectMapper.readValue(result, SessionDto.class);
                    assertEquals(session.getName(), outputSession.getName());
                });

    }

    @Nested
    public class updateTest {

        @Test
        @WithMockUser
        void shouldUpdate() throws Exception {

            SessionDto session = new SessionDto();
            session.setId(2L);
            session.setName("New name");
            session.setDescription("New description");
            session.setTeacher_id(2L);
            session.setDate(new Date());
            session.setUpdatedAt(LocalDateTime.now());
            session.setCreatedAt(LocalDateTime.now());

            mockMvc.perform(put("/api/session/2")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(session)))
                    .andExpect(status().isOk())
                    .andDo(r -> {
                        String result = r.getResponse().getContentAsString();
                        SessionDto outputSession = objectMapper.readValue(result, SessionDto.class);
                        assertEquals(session.getName(), outputSession.getName());
                    });

        }

        @Test
        @WithMockUser
        void shouldBadRequest() throws Exception {

            // WHEN & THEN
            mockMvc.perform(put("/api/session/not_a_number")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isBadRequest());

        }
    }

    @Nested
    public class saveTest {

        @Test
        @WithMockUser
        void shouldSave() throws Exception {
            mockMvc.perform(delete("/api/session/1")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk());
        }

        @Test
        @WithMockUser
        void shouldNotFound() throws Exception {
            mockMvc.perform(delete("/api/session/99")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isNotFound());
        }

        @Test
        @WithMockUser
        void shouldBadRequest() throws Exception {
            mockMvc.perform(delete("/api/session/not_a_number")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    public class participateTest {

        @Test
        @WithMockUser
        void shouldParticipate() throws Exception {

            Long sessionId = 2L;
            Long userId = 1L;

            mockMvc.perform(post("/api/session/" + sessionId + "/participate/" + userId)
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk());

            mockMvc.perform(get("/api/session/" + sessionId)
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andDo(r -> {
                        String result = r.getResponse().getContentAsString();
                        SessionDto outputSession = objectMapper.readValue(result, SessionDto.class);
                        assertEquals(userId, outputSession.getUsers().get(0));
                    });

        }

        @Test
        @WithMockUser
        void shouldBadRequest() throws Exception {

            mockMvc.perform(post("/api/session/" + "string_instead_long" + "/participate/" + "string_instead_long")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());

            mockMvc.perform(get("/api/session/" + "string_instead_long")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());

        }
    }

    @Nested
    public class noLongerParticipateTest {

        @Test
        @WithMockUser
        void shouldNotParticipate() throws Exception {


            Long sessionId = 1L;
            Long userId = 1L;

           mockMvc.perform(delete("/api/session/" + sessionId + "/participate/" + userId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

            mockMvc.perform(get("/api/session/" + sessionId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(r -> {
                    String result = r.getResponse().getContentAsString();
                    SessionDto outputSession = objectMapper.readValue(result, SessionDto.class);
                    assertEquals(0, outputSession.getUsers().size());
                });

        }

        @Test
        @WithMockUser
        void shouldBadRequest() throws Exception {

            mockMvc.perform(delete("/api/session/" + "string_instead_long" + "/participate/" + "string_instead_long")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());

            mockMvc.perform(get("/api/session/" + "string_instead_long")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());

        }
    }



}