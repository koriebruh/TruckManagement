package com.koriebruh.be.controller;


import com.koriebruh.be.dto.*;
import com.koriebruh.be.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {


    @Autowired
    private UserService profileService;

    @GetMapping(
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<ProfileResponse>> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        ProfileResponse profileResponse = profileService.getProfile(username);
        return ResponseEntity.ok(
                WebResponse.<ProfileResponse>builder()
                        .status("OK")
                        .data(profileResponse)
                        .build()
        );
    }

    @PostMapping(
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<UpdateProfileResponse>> updateProfile(@RequestBody @Valid ProfileRequest profileUpdate) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        UpdateProfileResponse msg = profileService.updateProfile(username, profileUpdate);
        return ResponseEntity.ok(
                WebResponse.<UpdateProfileResponse>builder()
                        .status("OK")
                        .data(msg)
                        .build()
        );
    }

    @PatchMapping(value = "/password",
            produces = "application/json"
    )
    public ResponseEntity<WebResponse<String>> updatePassword(@RequestBody @Valid UpdatePassRequest profileUpdate) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        String msg = profileService.updatePassword(username, profileUpdate);
        return ResponseEntity.ok(
                WebResponse.<String>builder()
                        .status("OK")
                        .data(msg)
                        .build()
        );
    }

}
