package top.valiev.grafeo.payload;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@EqualsAndHashCode(callSuper = true)
@Data
public class SignUpRequest extends ProfileRequest {

    @NotBlank
    @Size(min = 6, max = 20)
    private String password;
}