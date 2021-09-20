package com.finalproject.hrmsbackend.dataAccess.abstracts;

import com.finalproject.hrmsbackend.entities.concretes.JobAdvertisement;
import com.finalproject.hrmsbackend.entities.concretes.JobAdvertisementUpdate;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Transactional
@Repository
public interface JobAdvertisementDao extends JpaRepository<JobAdvertisement, Integer> {

    boolean existsByCity_IdAndPosition_IdAndEmployer_IdAndJobDescription(Short cityId, Short positionId, Integer employerId, String jobDescription);

    List<JobAdvertisement> findAllByEmployer_Id(Integer employerId);

    List<JobAdvertisement> findAllByActiveTrueAndVerifiedTrue();

    List<JobAdvertisement> findAllByActiveTrueAndVerifiedTrue(Sort sort);

    List<JobAdvertisement> findAllByActiveTrueAndVerifiedTrueAndDeadlineAfterAndEmployer_VerifiedTrue(LocalDate date, Sort sort);

    List<JobAdvertisement> findAllByActiveTrueAndVerifiedTrueAndDeadlineBefore(LocalDate date);

    List<JobAdvertisement> getAllByVerifiedFalse(Sort sort);

    List<JobAdvertisement> getAllByActiveTrueAndVerifiedTrueAndDeadlineAfterAndEmployer_Id(LocalDate date, Integer employerId, Sort sort);

    @Modifying
    @Query(value = "update job_advertisements set update_id = :updateId where id = :id", nativeQuery = true)
    void updateUpdateId(@Param(value = "updateId") Integer updateId, @Param(value = "id") Integer id);

    @Modifying
    @Query("update JobAdvertisement j set j.active = :status where j.id = :id")
    void updateActivation(@Param(value = "status") Boolean status, @Param(value = "id") Integer id);

    @Modifying
    @Query("update JobAdvertisement j set j.verified = :status where j.id = :id")
    void updateVerification(@Param(value = "status") Boolean status, @Param(value = "id") Integer id);

    @Modifying
    @Query("update JobAdvertisement j set j.rejected = :status where j.id = :id")
    void updateRejection(@Param(value = "status") Boolean status, @Param(value = "id") Integer id);

    @Modifying
    @Query("update JobAdvertisement j set j.updateVerified = :status where j.id = :id")
    void updateUpdateVerification(@Param(value = "status") Boolean status, @Param(value = "id") Integer id);

    @Modifying
    @Query("update JobAdvertisement j set j.lastModifiedAt = :lastModifiedAt where j.id = :id")
    void updateLastModifiedAt(@Param(value = "id") Integer id, LocalDateTime lastModifiedAt);

    @Modifying
    @Query("update JobAdvertisement j set j.position = :#{#jU.position}, j.city = :#{#jU.city}, j.jobDescription = :#{#jU.jobDescription}, j.openPositions = :#{#jU.openPositions}, j.minSalary = :#{#jU.minSalary}, j.maxSalary = :#{#jU.maxSalary}, j.workModel = :#{#jU.workModel}, j.workTime = :#{#jU.workTime}, j.deadline = :#{#jU.deadline} where j.id = :id")
    void applyUpdates(JobAdvertisementUpdate jU, Integer id);

}
