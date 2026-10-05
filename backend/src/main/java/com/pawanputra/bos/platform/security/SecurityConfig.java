package com.pawanputra.bos.platform.security;

import com.pawanputra.bos.platform.error.ErrorCode;
import com.pawanputra.bos.platform.logging.RequestCorrelationFilter;
import com.pawanputra.bos.platform.web.ApiErrorWriter;
import com.pawanputra.bos.platform.web.ApiPaths;
import java.util.List;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Stateless, deny-by-default API security.
 *
 * <p>Only the endpoints listed in {@link #PUBLIC_GET_ENDPOINTS} and the operational endpoints are reachable
 * without authentication. The identity module will add the authentication mechanism (token filter and
 * user store); until then every other endpoint answers 401.
 */
@Configuration
@EnableMethodSecurity
@EnableConfigurationProperties(CorsProperties.class)
public class SecurityConfig {

    static final String[] PUBLIC_GET_ENDPOINTS = {
        ApiPaths.V1 + "/system/**",
        ApiPaths.V1 + "/service-verticals/**",
    };

    static final String[] OPERATIONAL_ENDPOINTS = {
        "/actuator/health/**",
        "/actuator/info",
        "/actuator/prometheus", // not routed by Nginx; reachable on the internal network only
    };

    static final String[] API_DOCS_ENDPOINTS = {
        "/v3/api-docs/**",
        "/swagger-ui/**",
        "/swagger-ui.html",
    };

    @Bean
    SecurityFilterChain apiSecurityFilterChain(HttpSecurity http, ApiErrorWriter errorWriter) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // no cookies or sessions, so nothing for CSRF to ride on
                .cors(cors -> { })
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .requestCache(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(OPERATIONAL_ENDPOINTS).permitAll()
                        .requestMatchers(API_DOCS_ENDPOINTS).permitAll()
                        .requestMatchers(HttpMethod.GET, PUBLIC_GET_ENDPOINTS).permitAll()
                        .anyRequest().authenticated())
                .exceptionHandling(errors -> errors
                        .authenticationEntryPoint((request, response, ex) -> errorWriter.write(
                                request, response, ErrorCode.UNAUTHENTICATED,
                                "Authentication is required to access this resource"))
                        .accessDeniedHandler((request, response, ex) -> errorWriter.write(
                                request, response, ErrorCode.FORBIDDEN,
                                "You do not have permission to perform this action")));
        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource(CorsProperties properties) {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(properties.allowedOrigins());
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of(
                HttpHeaders.AUTHORIZATION, HttpHeaders.CONTENT_TYPE, HttpHeaders.ACCEPT,
                RequestCorrelationFilter.HEADER));
        config.setExposedHeaders(List.of(RequestCorrelationFilter.HEADER, HttpHeaders.LOCATION));
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }

    /**
     * Deliberately empty user store: it stops Spring Boot from generating a default user and password.
     * The identity module replaces this bean with the real one.
     */
    @Bean
    UserDetailsService userDetailsService() {
        return new InMemoryUserDetailsManager();
    }
}
