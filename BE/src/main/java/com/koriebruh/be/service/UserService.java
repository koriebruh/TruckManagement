package com.koriebruh.be.service;


import com.koriebruh.be.dto.ProfileRequest;
import com.koriebruh.be.dto.ProfileResponse;
import com.koriebruh.be.dto.UpdatePassRequest;
import com.koriebruh.be.dto.UpdateProfileResponse;
import com.koriebruh.be.entity.User;
import com.koriebruh.be.repository.UserRepository;
import com.koriebruh.be.utils.Encrypt;
import com.koriebruh.be.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ValidationService validationService;

    @Autowired
    private Encrypt encrypt;

    @Autowired
    private JwtUtil jwtUtil;


    // GET PROFIILE
    public ProfileResponse getProfile(String username) {
        User user = userRepository.findByUsernameAndDeletedAtIsNull(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return ProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .refreshToken(user.getRefreshToken())
                .email(user.getEmail())
                .role(user.getRole())
                .age(user.getAge())
                .phoneNumber(user.getPhoneNumber())
                .build();
    }

    // UPDATE PROFILE
    public UpdateProfileResponse updateProfile(String username, ProfileRequest profileUpdate) {
        validationService.validate(profileUpdate);

        User user = userRepository.findByUsernameAndDeletedAtIsNull(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (profileUpdate.getEmail() != null && !profileUpdate.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(profileUpdate.getEmail())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
            }
            user.setEmail(profileUpdate.getEmail());
        }

        if (profileUpdate.getUsername() != null && !profileUpdate.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(profileUpdate.getUsername())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "username already exists");
            }
            user.setUsername(profileUpdate.getUsername());
        }

        user.setPhoneNumber(profileUpdate.getPhoneNumber());
        user.setAge(profileUpdate.getAge());

        if (!username.equals(profileUpdate.getUsername())) {
            String refresh = jwtUtil.generateToken(user.getUsername(), 86400000L);
            user.setRefreshToken(refresh);
        }

        user.setUpdatedAt(Instant.now().getEpochSecond());
        userRepository.save(user);

        return UpdateProfileResponse.builder()
                .refreshToken(user.getRefreshToken())
                .build();
    }

    // UPDATE PASSWORD

    public String updatePassword(String username, UpdatePassRequest request) {
        validationService.validate(request);

        User user = userRepository.findByUsernameAndDeletedAtIsNull(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!encrypt.matchesPass(request.getCurrentPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New password and confirm password do not match");
        }

        user.setPassword(encrypt.encryptPass(request.getNewPassword()));
        user.setUpdatedAt(Instant.now().getEpochSecond());
        userRepository.save(user);

        return "Password updated successfully";
    }


}
