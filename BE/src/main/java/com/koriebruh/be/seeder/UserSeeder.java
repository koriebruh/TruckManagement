package com.koriebruh.be.seeder;


import com.koriebruh.be.entity.Enum.RoleType;
import com.koriebruh.be.entity.User;
import com.koriebruh.be.repository.UserRepository;
import com.koriebruh.be.utils.Encrypt;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;


@Component
@RequiredArgsConstructor
public class UserSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Encrypt encrypt;

    private static final Logger log = LoggerFactory.getLogger(UserSeeder.class);

    @Override
    public void run(String... args) throws Exception {

        List<User> users = Arrays.asList(
                createUser("ownerapp", "owner2024", "owner@company.com", RoleType.OWNER, "081234567001", 35L),
                createUser("jamalgantenk", "jamal123", "jamal@admin.com", RoleType.ADMIN, "081234567890", 21L),
                createUser("moderatorbudi", "budi456", "budi@moderator.com", RoleType.MODERATOR, "081234567002", 28L),
                createUser("driverandi", "andi789", "andi@driver.com", RoleType.DRIVER, "081234567003", 32L)
        );

        for (User user : users) {
            if (!userRepository.existsByUsername(user.getUsername())) {
                userRepository.save(user);
                log.info("✅ {} user seeded: {}", user.getRole(), user.getUsername());
            } else {
                log.info("ℹ️ {} user already exists: {}", user.getRole(), user.getUsername());
            }
        }

        log.info("🎉 User seeding process completed!");
    }

    private User createUser(String username, String password, String email, RoleType role, String phoneNumber, Long age) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(encrypt.encryptPass(password));
        user.setEmail(email);
        user.setRole(role);
        user.setPhoneNumber(phoneNumber);
        user.setAge(age);
        user.setCreatedAt(Instant.now().getEpochSecond());
        return user;
    }
}
