package com.koriebruh.be.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ProfileResponse {

    private String id;

    private String username;

    private String refreshToken;

    private String email;

    private String role;

    private String phoneNumber;

    private Long age;
}
