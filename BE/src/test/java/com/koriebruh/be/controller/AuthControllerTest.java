package com.koriebruh.be.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.koriebruh.be.dto.ErrorResponse;
import com.koriebruh.be.dto.RegisterRequest;
import com.koriebruh.be.dto.WebResponse;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author koriebruh
 * @sience 2024-07-21
 * This class is a placeholder for the AuthController test cases.
 */
@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@Transactional
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void testRegisterSuccess() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("testuser");
        request.setPassword("password123");
        request.setEmail("test@gmail.com");
        request.setPhoneNumber("1234567890");
        request.setAge(25L);

        // Debug: print request untuk memastikan data benar
        System.out.println("Request JSON: " + objectMapper.writeValueAsString(request));

        mockMvc.perform(
                        post("/auth/register")
                                .accept(MediaType.APPLICATION_JSON)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andDo(result -> {
                    System.out.println("Response: " + result.getResponse().getContentAsString());
                })
                .andExpect(status().isCreated())
                .andDo(result -> {
                    WebResponse<String> response = objectMapper.readValue(
                            result.getResponse().getContentAsString(),
                            new TypeReference<>() {}
                    );
                    Assertions.assertEquals("CREATED", response.getStatus());
                });
    }

    @Test
    void testRegisterDuplicateEmail() throws Exception {
        // First, register a user successfully
        RegisterRequest firstRequest = new RegisterRequest();
        firstRequest.setUsername("firstuser");
        firstRequest.setPassword("password123");
        firstRequest.setEmail("duplicate@gmail.com");
        firstRequest.setPhoneNumber("1234567890");
        firstRequest.setAge(25L);

        mockMvc.perform(
                post("/auth/register")
                        .accept(MediaType.APPLICATION_JSON)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(firstRequest))
        ).andExpect(status().isCreated());

        // Now try to register another user with the same email
        RegisterRequest duplicateRequest = new RegisterRequest();
        duplicateRequest.setUsername("seconduser");
        duplicateRequest.setPassword("password456");
        duplicateRequest.setEmail("duplicate@gmail.com"); // Same email
        duplicateRequest.setPhoneNumber("0987654321");
        duplicateRequest.setAge(30L);

        mockMvc.perform(
                        post("/auth/register")
                                .accept(MediaType.APPLICATION_JSON)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(duplicateRequest))
                )
                .andDo(result -> {
                    System.out.println("Duplicate Email Response: " + result.getResponse().getContentAsString());
                })
                .andExpect(status().isConflict())
                .andDo(result -> {
                    ErrorResponse<String> response = objectMapper.readValue(
                            result.getResponse().getContentAsString(),
                            new TypeReference<>() {}
                    );
                    Assertions.assertEquals("ERROR", response.getStatus()); // atau "CONFLICT"
                    // Bisa juga assert pesan error spesifik
                    Assertions.assertTrue(response.getErrors().toString().contains("Email") ||
                            response.getErrors().contains("Email address already in use"));
                });
    }

    @Test
    void testRegisterInvalidEmail() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("testuser");
        request.setPassword("password123");
        request.setEmail("invalid-email-format"); // Email tidak valid
        request.setPhoneNumber("1234567890");
        request.setAge(25L);

        System.out.println("Invalid Email Request JSON: " + objectMapper.writeValueAsString(request));

        mockMvc.perform(
                        post("/auth/register")
                                .accept(MediaType.APPLICATION_JSON)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andDo(result -> {
                    System.out.println("Invalid Email Response: " + result.getResponse().getContentAsString());
                })
                .andExpect(status().isBadRequest())
                .andDo(result -> {
                    // Gunakan Map untuk errors, bukan String
                    ErrorResponse<Map<String, String>> response = objectMapper.readValue(
                            result.getResponse().getContentAsString(),
                            new TypeReference<ErrorResponse<Map<String, String>>>() {}
                    );

                    Assertions.assertEquals("BAD_REQUEST", response.getStatus());
                    Assertions.assertTrue(response.getErrors().containsKey("email"));
                    Assertions.assertEquals("should contain email", response.getErrors().get("email"));
                });
    }

    @Test
    void testRegisterMultipleInvalidEmails() throws Exception {
        // Test berbagai format email yang tidak valid
        String[] invalidEmails = {
                "", // Empty email
                "plainaddress", // Missing @
                "@missingdomain.com", // Missing local part
                "missing@.com", // Missing domain
                "missing.domain@.com", // Invalid domain
                "spaces in@email.com", // Spaces in email
                "double@@domain.com" // Double @
        };

        for (String invalidEmail : invalidEmails) {
            RegisterRequest request = new RegisterRequest();
            request.setUsername("testuser" + invalidEmail.hashCode()); // Unique username
            request.setPassword("password123");
            request.setEmail(invalidEmail);
            request.setPhoneNumber("1234567890");
            request.setAge(25L);

            mockMvc.perform(
                            post("/auth/register")
                                    .accept(MediaType.APPLICATION_JSON)
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .content(objectMapper.writeValueAsString(request))
                    )
                    .andDo(result -> {
                        System.out.println("Testing email: '" + invalidEmail +
                                "' - Response: " + result.getResponse().getContentAsString());
                    })
                    .andExpect(status().isBadRequest());
        }
    }


}