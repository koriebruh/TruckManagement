package com.koriebruh.be.controller;


import com.koriebruh.be.dto.*;
import com.koriebruh.be.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {


    @Autowired
    private UserService userService;

    @GetMapping(
            value = "/profile",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<ProfileResponse>> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        ProfileResponse profileResponse = userService.getProfile(username);
        return ResponseEntity.ok(
                WebResponse.<ProfileResponse>builder()
                        .status("OK")
                        .data(profileResponse)
                        .build()
        );
    }

    @PostMapping(
            value = "/profile",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<UpdateProfileResponse>> updateProfile(@RequestBody @Valid ProfileRequest profileUpdate) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        UpdateProfileResponse msg = userService.updateProfile(username, profileUpdate);
        return ResponseEntity.ok(
                WebResponse.<UpdateProfileResponse>builder()
                        .status("OK")
                        .data(msg)
                        .build()
        );
    }

    @PatchMapping(value = "/profile/password",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<String>> updatePassword(@RequestBody @Valid UpdatePassRequest profileUpdate) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        String msg = userService.updatePassword(username, profileUpdate);
        return ResponseEntity.ok(
                WebResponse.<String>builder()
                        .status("OK")
                        .data(msg)
                        .build()
        );
    }

    @GetMapping(value = "/available",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<List<UserAvailableResponse>>> getAvailableUsers() {

        List<UserAvailableResponse> userAvailableResponse = userService.getAvailableDrivers();

        return ResponseEntity.ok(
                WebResponse.<List<UserAvailableResponse>>builder()
                        .status("OK")
                        .data(userAvailableResponse)
                        .build()
        );
    }

    @GetMapping(value = "/{userId}",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<UserResponse>> getUserById(@PathVariable String userId) {

        UserResponse users = userService.getUserById(userId);

        return ResponseEntity.ok(
                WebResponse.<UserResponse>builder()
                        .status("OK")
                        .data(users)
                        .build()
        );
    }

    @DeleteMapping(value = "/{userId}",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<String>> deleteUser(@PathVariable String userId) {
        String msg = userService.deleteUser(userId);
        return ResponseEntity.ok(
                WebResponse.<String>builder()
                        .status("OK")
                        .data(msg)
                        .build()
        );
    }

    @GetMapping("/operators")
    public ResponseEntity<WebResponse<List<UserResponse>>> getAllOperators() {
        List<UserResponse> users = userService.getAllUsers("OPERATOR");
        return ResponseEntity.ok(
                WebResponse.<List<UserResponse>>builder()
                        .status("OK")
                        .data(users)
                        .build()
        );
    }

    @GetMapping("/drivers")
    public ResponseEntity<WebResponse<List<UserResponse>>> getAllDrivers() {
        List<UserResponse> users = userService.getAllUsers("DRIVER");
        return ResponseEntity.ok(
                WebResponse.<List<UserResponse>>builder()
                        .status("OK")
                        .data(users)
                        .build()
        );
    }
}
