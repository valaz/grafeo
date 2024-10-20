package app.grafeo.payload;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserSummary {

    private Long id;
    private String username;
    private String email;
    private String name;
    private Boolean isDemo;
    private Boolean isSocialLogin;
    private String newAccessToken;
}