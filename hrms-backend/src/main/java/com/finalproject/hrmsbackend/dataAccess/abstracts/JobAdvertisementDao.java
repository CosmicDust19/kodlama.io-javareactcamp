package com.finalproject.hrmsbackend.dataAccess.abstracts;

import com.finalproject.hrmsbackend.entities.concretes.City;
import com.finalproject.hrmsbackend.entities.concretes.Employer;
import com.finalproject.hrmsbackend.entities.concretes.JobAdvertisement;
import com.finalproject.hrmsbackend.entities.concretes.Position;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;

@Transactional
@Repository
public interface JobAdvertisementDao extends JpaRepository<JobAdvertisement, Integer> {
    boolean existsByEmployerAndPositionAndJobDescriptionAndCity(Employer employer, Position position, String jobDescription, City city);

    List<JobAdvertisement> findAllByActivationStatusTrueAndSystemVerificationStatusTrue();

    List<JobAdvertisement> findAllByActivationStatusTrueAndSystemVerificationStatusTrue(Sort sort);

    List<JobAdvertisement> findAllByActivationStatusTrueAndSystemVerificationStatusTrueAndApplicationDeadlineAfterAndEmployer_SystemVerificationStatusTrue(LocalDate date , Sort sort);

    List<JobAdvertisement> findAllByActivationStatusTrueAndSystemVerificationStatusTrueAndApplicationDeadlineBefore(LocalDate date);

    List<JobAdvertisement> getAllBySystemVerificationStatusFalse(Sort sort);

    List<JobAdvertisement> getAllByActivationStatusTrueAndSystemVerificationStatusTrueAndApplicationDeadlineAfterAndEmployer_Id(LocalDate date, Integer employerId);

    @Modifying
    @Query("update JobAdvertisement j set j.position = :position where j.id = :id")
    void updatePosition(@Param(value = "position") Position position, @Param(value = "id") Integer id);

    @Modifying
    @Query("update JobAdvertisement j set j.jobDescription = :jobDescription where j.id = :id")
    void updateJobDescription(@Param(value = "jobDescription") String jobDescription, @Param(value = "id") Integer id);

    @Modifying
    @Query("update JobAdvertisement j set j.city = :city where j.id = :id")
    void updateCity(@Param(value = "city") City city, @Param(value = "id") Integer id);

    @Modifying
    @Query("update JobAdvertisement j set j.minSalary = :minSalary where j.id = :id")
    void updateMinSalary(@Param(value = "minSalary") Double minSalary, @Param(value = "id") Integer id);

    @Modifying
    @Query("update JobAdvertisement j set j.maxSalary = :maxSalary where j.id = :id")
    void updateMaxSalary(@Param(value = "maxSalary") Double maxSalary, @Param(value = "id") Integer id);

    @Modifying
    @Query("update JobAdvertisement j set j.workModel = :workModel where j.id = :id")
    void updateWorkModel(@Param(value = "workModel") String workModel, @Param(value = "id") Integer id);

    @Modifying
    @Query("update JobAdvertisement j set j.workTime = :workTime where j.id = :id")
    void updateWorkTime(@Param(value = "workTime") String workTime, @Param(value = "id") Integer id);

    @Modifying
    @Query("update JobAdvertisement j set j.applicationDeadline = :applicationDeadLine where j.id = :id")
    void updateApplicationDeadLine(@Param(value = "applicationDeadLine") LocalDate applicationDeadLine, @Param(value = "id") Integer id);

    @Modifying
    @Query("update JobAdvertisement j set j.activationStatus = :activationStatus where j.id = :id")
    void updateActivationStatus(@Param(value = "activationStatus") Boolean activationStatus, @Param(value = "id") Integer id);

    @Modifying
    @Query("update JobAdvertisement j set j.systemVerificationStatus = :systemVerificationStatus where j.id = :id")
    void updateSystemVerificationStatus(@Param(value = "systemVerificationStatus") Boolean systemVerificationStatus, @Param(value = "id") Integer id);

    @Modifying
    @Query("update JobAdvertisement j set j.systemRejectionStatus = :systemRejectionStatus where j.id = :id")
    void updateSystemRejectionStatus(@Param(value = "systemRejectionStatus") Boolean systemRejectionStatus, @Param(value = "id") Integer id);

}
