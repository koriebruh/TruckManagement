package com.koriebruh.be.repository;

import com.koriebruh.be.entity.Enum.RoleType;
import com.koriebruh.be.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    // Custom query methods can be defined here if needed
    Boolean existsByEmail(String email);

    Boolean existsByUsername(String username);

    Optional<User> findByUsernameAndDeletedAtIsNull(String username);

    Optional<User> findByIdAndDeletedAtIsNull(String id);

    @Query("SELECT u FROM User u WHERE u.deletedAt IS NULL " +
            "AND u.role = 'DRIVER' " +
            "AND NOT EXISTS (SELECT d FROM Delivery d WHERE d.worker.id = u.id AND d.finishedAt IS NULL)")
    List<User> findAllActiveDriverUsersNotInOngoingDelivery();

    Optional<User> findByRefreshToken(String refreshToken);

    List<User> findAllByRoleAndDeletedAtIsNull(RoleType role);
}
