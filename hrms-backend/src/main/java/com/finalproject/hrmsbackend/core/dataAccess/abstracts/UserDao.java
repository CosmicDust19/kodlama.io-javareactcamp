package com.finalproject.hrmsbackend.core.dataAccess.abstracts;

import com.finalproject.hrmsbackend.core.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.time.LocalDateTime;

@Transactional
@Repository
public interface UserDao extends JpaRepository<User, Integer> {
    boolean existsByEmail(String email);

    boolean existsByEmailAndPassword(String email, String password);

    boolean existsByIdAndPassword(Integer id, String password);

    @Modifying
    @Query("update User u set u.password = :password where u.id = :id")
    void updatePassword(@Param(value = "password") String password, @Param(value = "id") Integer id);

    @Modifying
    @Query("update User u set u.email = :email where u.id = :id")
    void updateEmail(@Param(value = "email") String email, @Param(value = "id") Integer id);

    @Modifying
    @Query("update User u set u.lastModifiedAt = :lastModifiedAt where u.id = :id")
    void updateLastModifiedAt(LocalDateTime lastModifiedAt, @Param(value = "id") Integer id);

}
