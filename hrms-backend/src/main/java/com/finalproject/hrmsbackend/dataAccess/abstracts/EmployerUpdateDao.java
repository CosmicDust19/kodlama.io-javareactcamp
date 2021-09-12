package com.finalproject.hrmsbackend.dataAccess.abstracts;

import com.finalproject.hrmsbackend.entities.concretes.EmployerUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Transactional
@Repository
public interface EmployerUpdateDao extends JpaRepository<EmployerUpdate, Integer> {

    boolean existsByCompanyName(String companyName);

    boolean existsByEmail(String email);

    boolean existsByWebsite(String website);

    @Modifying
    @Query("update EmployerUpdate e set e.email = :email , e.website = :website where e.updateId = :id")
    void updateEmailAndWebsite(@Param(value = "email") String email, @Param(value = "website") String website, @Param(value = "id") Integer id);

    @Modifying
    @Query("update EmployerUpdate e set e.companyName = :companyName where e.updateId = :updateId")
    void updateCompanyName(@Param(value = "companyName") String companyName, @Param(value = "updateId") Integer updateId);

    @Modifying
    @Query("update EmployerUpdate e set e.phoneNumber = :phoneNumber where e.updateId = :updateId")
    void updatePhoneNumber(@Param(value = "phoneNumber") String phoneNumber, @Param(value = "updateId") Integer updateId);

}
