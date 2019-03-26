package ru.valaz.grafeo.payload;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class FBLoginRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String email;

    @NotBlank
    private String userId;
}