package com.finalproject.hrmsbackend.dataAccess.abstracts;

import com.finalproject.hrmsbackend.entities.concretes.Employer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Transactional
@Repository
public interface EmployerDao extends JpaRepository<Employer,Integer> {
    boolean existsByEmailAndPassword(String email, String password);

    boolean existsByEmail(String email);

    boolean existsByWebsite(String website);

    boolean existsByCompanyName(String companyName);

    Employer getByEmailAndPassword(String email, String password);

    List<Employer> getAllBySystemVerificationStatusTrue();

    List<Employer> getAllBySystemVerificationStatusFalse();

    @Modifying
    @Query("update Employer employer set employer.email = :email where employer.id = :id")
    void updateEmail(@Param(value = "email") String email, @Param(value = "id") Integer id);

    @Modifying
    @Query("update Employer employer set employer.password = :password where employer.id = :id")
    void updatePassword(@Param(value = "password") String password, @Param(value = "id") Integer id);

    @Modifying
    @Query("update Employer employer set employer.companyName = :companyName where employer.id = :id")
    void updateCompanyName(@Param(value = "companyName") String companyName, @Param(value = "id") Integer id);

    @Modifying
    @Query("update Employer employer set employer.website = :website where employer.id = :id")
    void updateWebsite(@Param(value = "website") String website, @Param(value = "id") Integer id);

    @Modifying
    @Query("update Employer employer set employer.phoneNumber = :phoneNumber where employer.id = :id")
    void updatePhoneNumber(@Param(value = "phoneNumber") String phoneNumber, @Param(value = "id") Integer id);

    @Modifying
    @Query("update Employer employer set employer.systemVerificationStatus = :systemVerificationStatus where employer.id = :id")
    void updateSystemVerificationStatus(@Param(value = "systemVerificationStatus") boolean systemVerificationStatus, @Param(value = "id") Integer id);

    @Modifying
    @Query("update Employer employer set employer.systemRejectionStatus = :systemRejectionStatus where employer.id = :id")
    void updateSystemRejectionStatus(@Param(value = "systemRejectionStatus") boolean systemRejectionStatus, @Param(value = "id") Integer id);

}
