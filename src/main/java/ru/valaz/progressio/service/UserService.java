package ru.valaz.progressio.service;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ru.valaz.progressio.model.User;
import ru.valaz.progressio.payload.ProfileRequest;
import ru.valaz.progressio.repository.UserRepository;

@Component
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    public User updateUser(User user, ProfileRequest profileRequest) {
        user.setName(profileRequest.getName());
        user.setUsername(profileRequest.getUsername());
        user.setEmail(profileRequest.getEmail());
        if (StringUtils.isNotBlank(profileRequest.getPassword())) {
            user.setPassword(passwordEncoder.encode(profileRequest.getPassword()));
        }

        return userRepository.save(user);
    }
}
