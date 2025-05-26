package com.openclassrooms.starterjwt.security;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.util.MimeTypeUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.security.jwt.AuthEntryPointJwt;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class AuthEntryPointJwtTest {
    private AuthEntryPointJwt authEntryPointJwt = new AuthEntryPointJwt();

    /*/
        * On teste la méthode commence de la classe AuthEntryPointJwt (implémentant AuthenticationEntryPoint)
        * Elle est censé se déclencher lorsqu'un utilisateur non authentifié tente d'accéder à une ressource protégée
     */
    @Test
    void commenceTest() throws IOException, ServletException {
        // GIVEN
        // On crée une requête et une réponse HTTP fictives
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        // On crée une exception d'authentification avec un message d'erreur spécifique
        AuthenticationException authException = new AuthenticationException("Unauthorized error message") {};

        // WHEN
        // On appelle la méthode commence avec la requête, la réponse et l'exception d'authentification
        authEntryPointJwt.commence(request, response, authException);

        // THEN
        // On vérifie que le statut de la réponse HTTP est SC_UNAUTHORIZED (ce qui signifie que le serveur a refusé la requête car l'utilisateur n'est pas autorisé)
        assertThat(response.getStatus()).isEqualTo(HttpServletResponse.SC_UNAUTHORIZED);

        // On vérifie que le type de contenu de la réponse est APPLICATION_JSON_VALUE (ce qui signifie que la réponse est au format JSON)
        assertThat(response.getContentType()).isEqualTo(MimeTypeUtils.APPLICATION_JSON_VALUE);

        // On lit le corps de la réponse et le convertit en une Map
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> responseBody = objectMapper.readValue(response.getContentAsString(), Map.class);

        // On vérifie que le corps de la réponse contient les bonnes informations (statut, erreur, message, chemin)
        assertThat(responseBody.get("status")).isEqualTo(HttpServletResponse.SC_UNAUTHORIZED);
        assertThat(responseBody.get("error")).isEqualTo("Unauthorized");
        assertThat(responseBody.get("message")).isEqualTo("Unauthorized error message");
        assertThat(responseBody.get("path")).isEqualTo(request.getServletPath());
    }

}