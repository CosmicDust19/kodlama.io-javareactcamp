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
public interface SystemEmployeeDao extends JpaRepository<SystemEmployee, Integer> {

    boolean existsByEmailAndPassword(String email, String password);

    SystemEmployee getByEmailAndPassword(String email, String password);

    @Modifying
    @Query("update SystemEmployee sE set sE.firstName = :firstName where sE.id = :id")
    void updateFirstName(@Param(value = "firstName") String firstName, @Param(value = "id") Integer id);

    @Modifying
    @Query("update SystemEmployee sE set sE.lastName = :lastName where sE.id = :id")
    void updateLastName(@Param(value = "lastName") String lastName, @Param(value = "id") Integer id);

}
