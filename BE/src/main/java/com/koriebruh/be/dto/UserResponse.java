package com.koriebruh.be.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class UserResponse {
    private String id;

    private String username;

    private String email;

    private String role;

    private String phoneNumber;

    private Long age;
}
