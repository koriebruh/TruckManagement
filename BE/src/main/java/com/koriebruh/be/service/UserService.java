package com.koriebruh.be.service;


import com.koriebruh.be.dto.*;
import com.koriebruh.be.entity.Enum.RoleType;
import com.koriebruh.be.entity.User;
import com.koriebruh.be.repository.UserRepository;
import com.koriebruh.be.utils.Encrypt;
import com.koriebruh.be.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

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
                .role(user.getRole().name())
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
        Long sevenDaysInMillis = 604800000L;

        if (!username.equals(profileUpdate.getUsername())) {
            String refresh = jwtUtil.generateToken(user.getUsername(), sevenDaysInMillis);
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


    // GET USER Available DELIVERY
    public List<UserAvailableResponse> getAvailableDrivers() {

        List<User> users = userRepository.findAllActiveDriverUsersNotInOngoingDelivery();
        if (users.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No available drivers found, all drivers are in active delivery");
        }

        return users.stream()
                .map(user -> UserAvailableResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .phoneNumber(user.getPhoneNumber())
                        .age(user.getAge())
                        .build())
                .toList();
    }

    // GET USER BY ID
    public UserResponse getUserById(String userId) {

        User user = userRepository.findByIdAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .age(user.getAge())
                .role(user.getRole().name())
                .build();
    }

    // DELETE USER
    public String deleteUser(String username) {
        User user = userRepository.findByUsernameAndDeletedAtIsNull(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        user.setDeletedAt(Instant.now().getEpochSecond());
        userRepository.save(user);

        return "User deleted successfully";
    }

    // GET ALL USERS
    public List<UserResponse> getAllUsers(String queryRole) {
        validationService.validate(queryRole);

        if (!queryRole.equalsIgnoreCase("OPERATOR") && !queryRole.equalsIgnoreCase("DRIVER")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role type. Only USER or DRIVER are allowed.");
        }
        List<User> users = userRepository.findAllByRoleAndDeletedAtIsNull(RoleType.valueOf(queryRole.toUpperCase()));

        if (users.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "make sure role Type is correct and user exists");
        }

        return users.stream()
                .map(user -> UserResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .phoneNumber(user.getPhoneNumber())
                        .age(user.getAge())
                        .role(user.getRole().name())
                        .build())
                .toList();
    }
}
