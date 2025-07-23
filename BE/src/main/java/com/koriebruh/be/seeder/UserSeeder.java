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

        if (!userRepository.existsByUsername("jamalgantenk")){
            User admin = new User();
            admin.setUsername("jamalgantenk");
            admin.setPassword(encrypt.encryptPass("jamal123"));
            admin.setEmail("jamal@admin.com");
            admin.setRole(RoleType.ADMIN);
            admin.setPhoneNumber("081234567890");
            admin.setAge(21L);
            admin.setCreatedAt(Instant.now().getEpochSecond());

            userRepository.save(admin);
            log.info("✅ Admin user seeded: {}", admin.getUsername());
        } else {
            log.info("ℹ️ UserSeeder: Users already exist, skipping seeding.");
        }
    }

}
