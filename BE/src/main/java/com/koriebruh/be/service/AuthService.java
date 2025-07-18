package com.koriebruh.be.service;

import com.koriebruh.be.dto.LoginRequest;
import com.koriebruh.be.dto.LoginResponse;
import com.koriebruh.be.dto.RegisterRequest;
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
        String refreshToken;
        try {
            if (user.getRefreshToken() != null && jwtUtil.validateToken(user.getRefreshToken(), user.getUsername())) {
                refreshToken = user.getRefreshToken();
            } else {
                refreshToken = jwtUtil.generateToken(user.getUsername(), 86400000L);
                user.setRefreshToken(refreshToken);
                userRepository.save(user);
            }
        } catch (ExpiredJwtException e) {
            // Token lama expired, generate baru (1 day)
            refreshToken = jwtUtil.generateToken(user.getUsername(), 86400000L);
            user.setRefreshToken(refreshToken);
            userRepository.save(user);
        }

        // Access token always generated fresh (15 minutes)
        String accessToken = jwtUtil.generateToken(user.getUsername(), 900000L);

        LoginResponse result = new LoginResponse();
        result.setAccessToken(accessToken);
        result.setRefreshToken(refreshToken);
        result.setTokenType("Bearer");
        return result;
    }
}