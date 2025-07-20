package com.koriebruh.be.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class UserAvailableResponse {

    private String id;

    private String username;

    private String email;

    private String phoneNumber;

    private Long age;

}
