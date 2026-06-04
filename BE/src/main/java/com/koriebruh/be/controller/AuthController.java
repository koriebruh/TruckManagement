package com.koriebruh.be.controller;


import com.koriebruh.be.config.ApiStandardErrors;
import com.koriebruh.be.dto.*;
import com.koriebruh.be.service.AuthService;
import com.koriebruh.be.utils.JwtUtil;
import com.koriebruh.be.utils.RequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping(value = "/login",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<WebResponse<LoginResponse>> loginUser(
            @RequestBody @Valid LoginRequest request,
            HttpServletRequest httpRequest
    ) {
        String clientIp = RequestUtil.getClientIp(httpRequest);

        logger.debug("Received login request for username: {} from IP: {}", request.getUsername(), clientIp);

        LoginResponse response = authService.loginUser(request);
        
        logger.info("Login successful [username={}, ip={}]", request.getUsername(), clientIp);
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
    public ResponseEntity<WebResponse<String>> registerUser(
            @RequestBody @Valid RegisterRequest request, 
            HttpServletRequest httpRequest
    ) {
        String clientIp = RequestUtil.getClientIp(httpRequest);
        
        logger.debug("Received registration request for username: {} from IP: {}", request.getUsername(), clientIp);
        String msg = authService.registerUser(request);
        logger.info("User registration completed for username: {}, ip={}", request.getUsername(), clientIp);
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
    public ResponseEntity<WebResponse<ValidateResponse>> validatedToken(
            @RequestHeader("Authorization") String authHeader, 
            HttpServletRequest httpRequest
    ) {
        String clientIp = RequestUtil.getClientIp(httpRequest);
        
        logger.debug("Received token validation request from IP: {}", clientIp);
        /* Check if the Authorization header is present and starts with "Bearer "
         *Authorization: Bearer <token>
         */
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("Authorization header missing or invalid from IP: {}", clientIp);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authorization header is missing or invalid");
        }

        String token = authHeader.substring(7);
        String username = jwtUtil.getUsernameFromToken(token);
        logger.debug("Validating token for username: {} from IP: {}", username, clientIp);

        if (!jwtUtil.validateToken(token, username)) {
            logger.warn("Invalid token for username: {} from IP: {}", username, clientIp);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token is invalid");
        }

        String userRole = authService.getRole(username);
        logger.debug("Retrieved role for user {}: {} from IP: {}", username, userRole, clientIp);

        ValidateResponse validateResponse = new ValidateResponse();
        validateResponse.setMessage("Token is valid");
        validateResponse.setRole(userRole);

        logger.info("Token validation successful for username: {} from IP: {}", username, clientIp);
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
    public ResponseEntity<WebResponse<RefreshTokenResponse>> RefreshTokenGenerateAccessToken(
            @RequestBody @Valid RefreshTokenRequest request,
            HttpServletRequest httpRequest
    ) {
        String clientIp = RequestUtil.getClientIp(httpRequest);

        logger.info("🔄 [TOKEN REFRESH] Refresh token request received from IP: {}", clientIp);
        
        String token = request.getRefreshToken();
        String tokenPrefix = token != null && token.length() > 20 ? token.substring(0, 20) + "..." : token;
        logger.debug("🔑 [TOKEN REFRESH] Refresh token (prefix): {}", tokenPrefix);

        String username = jwtUtil.getUsernameFromToken(token);
        logger.info("👤 [TOKEN REFRESH] Processing refresh for user: {}", username);

        if (!jwtUtil.validateToken(token, username)) {
            logger.warn("⚠️ [TOKEN REFRESH] Invalid refresh token for user: {} from IP: {}", username, clientIp);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token is invalid");
        }

        RefreshTokenResponse refreshTokenResponse = authService.getAccessToken(request);
        logger.info("✅ [TOKEN REFRESH] Successfully refreshed access token for user: {} from IP: {}", username, clientIp);

        return ResponseEntity.ok(
                WebResponse.<RefreshTokenResponse>builder()
                        .status("OK")
                        .data(refreshTokenResponse)
                        .build()
        );
    }
}

