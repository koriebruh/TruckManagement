package com.koriebruh.be.service;

import com.koriebruh.be.dto.*;
import com.koriebruh.be.entity.User;
import com.koriebruh.be.repository.UserRepository;
import com.koriebruh.be.utils.Encrypt;
import com.koriebruh.be.utils.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Optional;


@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ValidationService validationService;

    @Autowired
    private Encrypt encrypt;

    @Autowired
    private JwtUtil jwtUtil;

    public String registerUser(RegisterRequest request) {
        validationService.validate(request);

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username address already in use");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
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
        newUser.setRole("driver"); // Default role, can be changed later

        userRepository.save(newUser);
        return "User registered successfully";
    }

    public LoginResponse loginUser(LoginRequest request) {
        Optional<User> userOps = userRepository.findByUsernameAndDeletedAtIsNull(request.getUsername());
        if (userOps.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username or Password wrong");
        }

        User user = userOps.get();

        /* Validated password
         * */
        if (!encrypt.matchesPass(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username or Password wrong");
        }

        /* Ambil user berdasarkan username + deletedAt null
         * Cek password valid atau enggak
         * Cek refresh token valid (tapi amanin dari error)
         * Generate access token baru setiap login
         * Kalau refresh token nggak valid, generate baru
         * */
        Long sevenDaysInMillis = 604800000L; // 7 days in milliseconds
        Long fifteenMillis = 900000L; // 15 minutes in milliseconds
        String refreshToken;
        try {
            if (user.getRefreshToken() != null && jwtUtil.validateToken(user.getRefreshToken(), user.getUsername())) {
                refreshToken = user.getRefreshToken();
            } else {
                refreshToken = jwtUtil.generateToken(user.getUsername(), sevenDaysInMillis);
                user.setRefreshToken(refreshToken);
                userRepository.save(user);
            }
        } catch (ExpiredJwtException e) {
            // Token lama expired, generate baru (7 day)
            refreshToken = jwtUtil.generateToken(user.getUsername(), sevenDaysInMillis);
            user.setRefreshToken(refreshToken);
            userRepository.save(user);
        }

        // Access token always generated fresh (15 minutes)
        String accessToken = jwtUtil.generateToken(user.getUsername(), fifteenMillis);

        LoginResponse result = new LoginResponse();
        result.setAccessToken(accessToken);
        result.setRefreshToken(refreshToken);
        result.setTokenType("Bearer");
        return result;
    }

    public String getRole(String username) {
        Optional<User> userOps = userRepository.findByUsernameAndDeletedAtIsNull(username);
        if (userOps.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        return userOps.get().getRole();
    }

    public RefreshTokenResponse getAccessToken(RefreshTokenRequest request) {
        Long fifteenMillis = 900000L; // 15 minutes in milliseconds

        Optional<User> userOps = userRepository.findByRefreshToken(request.getRefreshToken());
        if (userOps.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Refresh token is not found");
        }

        User user = userOps.get();
        if (user.getRefreshToken() == null || !jwtUtil.validateToken(user.getRefreshToken(), user.getUsername())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token do login again");
        }

        // Generate new access token fresh 15 minutes
        String tokenAccess = jwtUtil.generateToken(user.getUsername(), fifteenMillis);

        // Return the new access token
        return RefreshTokenResponse.builder()
                .accessToken(tokenAccess)
                .build();
    }

}