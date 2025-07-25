package com.koriebruh.be.controller;


import com.koriebruh.be.config.ApiStandardErrors;
import com.koriebruh.be.dto.*;
import com.koriebruh.be.service.AuthService;
import com.koriebruh.be.utils.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth/")
//@ApiStandardErrors
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping(value = "/login",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<WebResponse<LoginResponse>> loginUser(@RequestBody @Valid LoginRequest request) {
        LoginResponse response = authService.loginUser(request);
        return ResponseEntity.status(HttpStatus.OK).body(
                WebResponse.<LoginResponse>builder()
                        .status("OK")
                        .data(response)
                        .build()
        );
    }

    @PostMapping(value = "/register",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<WebResponse<String>> registerUser(@RequestBody @Valid RegisterRequest request) {
        String msg = authService.registerUser(request);
        System.out.println("REGISTER REACHED");
        return ResponseEntity.status(HttpStatus.CREATED).body(
                WebResponse.<String>builder()
                        .status("CREATED")
                        .data(msg)
                        .build()
        );
    }

    @GetMapping(value = "/validate",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<WebResponse<ValidateResponse>> validatedToken(@RequestHeader("Authorization") String authHeader) {
        /* Check if the Authorization header is present and starts with "Bearer "
         *Authorization: Bearer <token>
         */
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authorization header is missing or invalid");
        }

        String token = authHeader.substring(7);
        String username = jwtUtil.getUsernameFromToken(token);

        if (!jwtUtil.validateToken(token, username)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token is invalid");
        }

        String userRole = authService.getRole(username);

        ValidateResponse validateResponse = new ValidateResponse();
        validateResponse.setMessage("Token is valid");
        validateResponse.setRole(userRole);


        return ResponseEntity.ok(
                WebResponse.<ValidateResponse>builder()
                        .status("OK")
                        .data(validateResponse)
                        .build()
        );
    }

    @PostMapping(value = "/refresh-token",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<WebResponse<RefreshTokenResponse>> RefreshTokenGenerateAccessToken(@RequestBody @Valid RefreshTokenRequest request) {
        /* Check if the Authorization header is present and starts with "Bearer "
         *Authorization: Bearer <token>
         */
        String token = request.getRefreshToken();

        String username = jwtUtil.getUsernameFromToken(token);

        if (!jwtUtil.validateToken(token, username)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token is invalid");
        }

        RefreshTokenResponse refreshTokenResponse = authService.getAccessToken(request);


        return ResponseEntity.ok(
                WebResponse.<RefreshTokenResponse>builder()
                        .status("OK")
                        .data(refreshTokenResponse)
                        .build()
        );
    }
}