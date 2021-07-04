package com.finalproject.hrmsbackend.dataAccess.abstracts;

import com.finalproject.hrmsbackend.entities.concretes.SystemEmployee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Transactional
@Repository
public interface SystemEmployeeDao extends JpaRepository<SystemEmployee,Integer> {
    boolean existsByEmailAndPassword(String email, String password);

    boolean existsByEmail(String email);

    SystemEmployee getByEmailAndPassword(String email, String password);

    @Modifying
    @Query("update SystemEmployee systemEmployee set systemEmployee.email = :email where systemEmployee.id = :id")
    void updateEmail(@Param(value = "email") String email, @Param(value = "id") Integer id);

    @Modifying
    @Query("update SystemEmployee systemEmployee set systemEmployee.password = :password where systemEmployee.id = :id")
    void updatePassword(@Param(value = "password") String password, @Param(value = "id") Integer id);

    @Modifying
    @Query("update SystemEmployee systemEmployee set systemEmployee.firstName = :firstName where systemEmployee.id = :id")
    void updateFirstName(@Param(value = "firstName") String firstName, @Param(value = "id") Integer id);

    @Modifying
    @Query("update SystemEmployee systemEmployee set systemEmployee.lastName = :lastName where systemEmployee.id = :id")
    void updateLastName(@Param(value = "lastName") String lastName, @Param(value = "id") Integer id);

}
