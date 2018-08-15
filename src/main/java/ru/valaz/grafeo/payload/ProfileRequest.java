package ru.valaz.grafeo.payload;

import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class ProfileRequest {
    @NotBlank
    @Size(min = 1, max = 40)
    protected String name;

    @NotBlank
    @Size(min = 3, max = 30)
    protected String username;

    @NotBlank
    @Size(max = 40)
    @Email
    protected String email;

    private String password;
}