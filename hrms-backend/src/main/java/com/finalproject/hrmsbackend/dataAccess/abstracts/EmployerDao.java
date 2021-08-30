package com.finalproject.hrmsbackend.dataAccess.abstracts;

import com.finalproject.hrmsbackend.entities.concretes.Employer;
import com.finalproject.hrmsbackend.entities.concretes.EmployerUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Transactional
@Repository
public interface EmployerDao extends JpaRepository<Employer, Integer> {

    boolean existsByEmailAndPassword(String email, String password);

    boolean existsByWebsite(String website);

    boolean existsByCompanyName(String companyName);

    Employer getByEmailAndPassword(String email, String password);

    List<Employer> getAllByVerifiedTrue();

    List<Employer> getAllByVerifiedFalse();

    @Modifying
    @Query(value = "update employers set update_id = :updateId where user_id = :id", nativeQuery = true)
    void updateUpdateId(@Param(value = "updateId") Integer updateId, @Param(value = "id") Integer id);

    @Modifying
    @Query("update Employer e set e.verified = :status where e.id = :id")
    void updateVerification(@Param(value = "status") boolean status, @Param(value = "id") Integer id);

    @Modifying
    @Query("update Employer e set e.rejected = :status where e.id = :id")
    void updateRejection(@Param(value = "status") boolean status, @Param(value = "id") Integer id);

    @Modifying
    @Query("update Employer e set e.updateVerified = :status where e.id = :id")
    void updateUpdateVerification(@Param(value = "status") boolean status, @Param(value = "id") Integer id);

    @Modifying
    @Query("update Employer e set e.companyName = :#{#eU.companyName}, e.website = :#{#eU.website}, e.email = :#{#eU.email}, e.phoneNumber = :#{#eU.phoneNumber} where e.id = :id")
    void applyUpdates(EmployerUpdate eU, Integer id);

}
