package com.koriebruh.be.repository;

import com.koriebruh.be.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Custom query methods can be defined here if needed
    Boolean existsByEmail(String email);

    Boolean existsByUsername(String username);

    Optional<User> findByUsernameAndDeletedAtIsNull(String username);

}
