package app.grafeo.payload;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class FBLoginRequest {
    @NotBlank
    private String userId;

    @NotBlank
    private String token;
}