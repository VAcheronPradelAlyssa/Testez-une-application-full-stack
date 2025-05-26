package com.openclassrooms.starterjwt.security;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;

import com.openclassrooms.starterjwt.security.jwt.AuthTokenFilter;

import static org.assertj.core.api.Assertions.assertThat;

class AuthTokenFilterTest {

    private final AuthTokenFilter authTokenFilter = new AuthTokenFilter();

    // On teste le parsing d'un token valide
    @Test
    void parseJwtValidToken() {
        // GIVEN
        // On crée une requête HTTP fictive et on y ajoute un en-tête "Authorization" avec un token valide
        MockHttpServletRequest request = new MockHttpServletRequest();
        String validToken = "validToken";
        request.addHeader("Authorization", "Bearer " + validToken);

        // WHEN
        // On appelle la méthode parseJwt avec la requête
        String result = authTokenFilter.parseJwt(request);

        // THEN
        // On vérifie que le résultat est égal au token valide
        assertThat(result).isEqualTo(validToken);
    }

    // On teste le parsing d'un token invalide
    @Test
    void parseJwtNoTokenInHeader() {
        // GIVEN
        // On crée une requête HTTP fictive sans en-tête "Authorization"
        MockHttpServletRequest request = new MockHttpServletRequest();

        // WHEN
        // On appelle la méthode parseJwt avec la requête
        String result = authTokenFilter.parseJwt(request);

        // THEN
        // On vérifie que le résultat est null car il n'y a pas de token dans la requête
        assertThat(result).isNull();
    }

}