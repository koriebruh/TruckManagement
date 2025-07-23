package com.koriebruh.be.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "can't be blank")
    @Size(min = 1, max = 70, message = "length name around 1 - 70 digit")
    private String username;

    @NotBlank(message = "password can't be blank")
    @Size(min = 8, max = 70, message = "length password around 8 - 70 digit")
    private String password;

    @NotBlank(message = "email can't be blank")
    @Email(message = "should contain email")
    private String email;

    @NotBlank(message = "phone number can't be blank")
    @Size(min = 8, max = 15, message = "length phone around 8 - 15 digit")
    private String phoneNumber;

    @NotNull(message = "age can't be null")
    @Min(value = 18, message = "age minimum 18 Y.O.")
    @Max(value = 65, message = "age maximum 65 Y.O.")
    private Long age;
}