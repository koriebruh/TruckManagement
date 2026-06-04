package com.koriebruh.be.service;

import com.koriebruh.be.dto.*;
import com.koriebruh.be.entity.Enum.RoleType;
import com.koriebruh.be.entity.User;
import com.koriebruh.be.repository.UserRepository;
import com.koriebruh.be.utils.Encrypt;
import com.koriebruh.be.utils.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Optional;


@Service
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ValidationService validationService;

    @Autowired
    private Encrypt encrypt;

    @Autowired
    private JwtUtil jwtUtil;

    public String registerUser(RegisterRequest request) {
        logger.debug("Processing registration request for username: {}", request.getUsername());
        validationService.validate(request);

        if (userRepository.existsByUsername(request.getUsername())) {
            logger.warn("Registration failed - Username already exists: {}", request.getUsername());
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username address already in use");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            logger.warn("Registration failed - Email already exists: {}", request.getEmail());
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email address already in use");
        }

        //ENCRYPT PASSWORD
        String encryptedPass = encrypt.encryptPass(request.getPassword());

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(encryptedPass);
        newUser.setCreatedAt(Instant.now().getEpochSecond());
        newUser.setPhoneNumber(request.getPhoneNumber());
        newUser.setAge(request.getAge());
        newUser.setRole(RoleType.DRIVER); // Default role, can be changed later

        userRepository.save(newUser);
        logger.debug("User registered successfully: {}", request.getUsername());
        return "User registered successfully";
    }

    public LoginResponse loginUser(LoginRequest request) {
        logger.debug("Processing login request for username: {}", request.getUsername());
        Optional<User> userOps = userRepository.findByUsernameAndDeletedAtIsNull(request.getUsername());
        if (userOps.isEmpty()) {
            logger.warn("Login failed - User not found: {}", request.getUsername());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username or Password wrong");
        }

        User user = userOps.get();

        /* Validated password
         * */
        if (!encrypt.matchesPass(request.getPassword(), user.getPassword())) {
            logger.warn("Login failed - Invalid password for user: {}", request.getUsername());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username or Password wrong");
        }

        /* Ambil user berdasarkan username + deletedAt null
         * Cek password valid atau enggak
         * Cek refresh token valid (tapi amanin dari error)
         * Generate access token baru setiap login
         * Kalau refresh token nggak valid, generate baru
         * */
        Long sevenDaysInMillis = 604800000L; // 7 days in milliseconds
        Long fifteenMillis = 10000L;; // 15 minutes in milliseconds
        String refreshToken;
        try {
            if (user.getRefreshToken() != null && jwtUtil.validateToken(user.getRefreshToken(), user.getUsername())) {
                logger.debug("Using existing valid refresh token for user: {}", user.getUsername());
                refreshToken = user.getRefreshToken();
            } else {
                logger.debug("Generating new refresh token for user: {}", user.getUsername());
                refreshToken = jwtUtil.generateToken(user.getUsername(), sevenDaysInMillis);
                user.setRefreshToken(refreshToken);
                userRepository.save(user);
            }
        } catch (ExpiredJwtException e) {
            // Token lama expired, generate baru (7 day)
            logger.debug("Refresh token expired for user: {}. Generating new one", user.getUsername());
            refreshToken = jwtUtil.generateToken(user.getUsername(), sevenDaysInMillis);
            user.setRefreshToken(refreshToken);
            userRepository.save(user);
        }

        // Access token always generated fresh (15 minutes)
        logger.debug("Generating new access token for user: {}", user.getUsername());
        String accessToken = jwtUtil.generateToken(user.getUsername(), fifteenMillis);

        LoginResponse result = new LoginResponse();
        result.setAccessToken(accessToken);
        result.setRefreshToken(refreshToken);
        result.setTokenType("Bearer");
        
        logger.debug("User logged in successfully: {}", user.getUsername());
        return result;
    }

    public String getRole(String username) {
        logger.debug("Getting role for username: {}", username);
        User userOps = userRepository.findByUsernameAndDeletedAtIsNull(username)
                .orElseThrow(() -> {
                    logger.warn("User not found when retrieving role: {}", username);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
                });
        logger.debug("Retrieved role {} for user: {}", userOps.getRole().name(), username);
        return userOps.getRole().name();
    }

    public RefreshTokenResponse getAccessToken(RefreshTokenRequest request) {
        logger.debug("🔧 [TOKEN REFRESH] Generating new tokens...");
        Long fifteenMillis = 10000L; // 15 minutes in milliseconds
        Long sevenDaysInMillis = 604800000L; // 7 days in milliseconds

        Optional<User> userOps = userRepository.findByRefreshToken(request.getRefreshToken());
        if (userOps.isEmpty()) {
            logger.warn("⚠️ [TOKEN REFRESH] Refresh token not found: {}", request.getRefreshToken());
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Refresh token is not found");
        }

        User user = userOps.get();
        if (user.getRefreshToken() == null || !jwtUtil.validateToken(user.getRefreshToken(), user.getUsername())) {
            logger.warn("⚠️ [TOKEN REFRESH] Invalid refresh token for user: {}", user.getUsername());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token do login again");
        }

        // Generate new access token fresh 15 minutes
        logger.debug("🔑 [TOKEN REFRESH] Generating new access token for user: {} (expires in 15 min)", user.getUsername());
        String tokenAccess = jwtUtil.generateToken(user.getUsername(), fifteenMillis);

        // Generate new refresh token for rotation (7 days)
        logger.debug("🔄 [TOKEN REFRESH] Generating new refresh token for user: {} (expires in 7 days)", user.getUsername());
        String newRefreshToken = jwtUtil.generateToken(user.getUsername(), sevenDaysInMillis);
        user.setRefreshToken(newRefreshToken);
        userRepository.save(user);

        // Return the new access token and refresh token
        logger.info("✅ [TOKEN REFRESH] Tokens generated successfully for user: {}", user.getUsername());
        logger.debug("   Access Token (prefix): {}", tokenAccess != null && tokenAccess.length() > 20 ? tokenAccess.substring(0, 20) + "..." : tokenAccess);
        logger.debug("   Refresh Token (prefix): {}", newRefreshToken != null && newRefreshToken.length() > 20 ? newRefreshToken.substring(0, 20) + "..." : newRefreshToken);
        
        return RefreshTokenResponse.builder()
                .accessToken(tokenAccess)
                .refreshToken(newRefreshToken)
                .build();
    }

}
