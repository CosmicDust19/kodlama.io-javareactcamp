package com.finalproject.hrmsbackend.dataAccess.abstracts;

import com.finalproject.hrmsbackend.entities.concretes.City;
import com.finalproject.hrmsbackend.entities.concretes.JobAdvertisementUpdate;
import com.finalproject.hrmsbackend.entities.concretes.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.time.LocalDate;

@Transactional
@Repository
public interface JobAdvertisementUpdateDao extends JpaRepository<JobAdvertisementUpdate, Integer> {

    boolean existsByCity_IdAndPosition_IdAndEmployer_IdAndJobDescription(Short cityId, Short positionId, Integer employerId, String jobDescription);

    @Modifying
    @Query("update JobAdvertisementUpdate j set j.position = :position where j.updateId = :updateId")
    void updatePosition(@Param(value = "position") Position position, @Param(value = "updateId") Integer updateId);

    @Modifying
    @Query("update JobAdvertisementUpdate j set j.jobDescription = :jobDescription where j.updateId = :updateId")
    void updateJobDesc(@Param(value = "jobDescription") String jobDescription, @Param(value = "updateId") Integer updateId);

    @Modifying
    @Query("update JobAdvertisementUpdate j set j.city = :city where j.updateId = :updateId")
    void updateCity(@Param(value = "city") City city, @Param(value = "updateId") Integer updateId);

    @Modifying
    @Query("update JobAdvertisementUpdate j set j.openPositions = :openPositions where j.updateId = :updateId")
    void updateOpenPositions(@Param(value = "openPositions") Short openPositions, @Param(value = "updateId") Integer updateId);

    @Modifying
    @Query("update JobAdvertisementUpdate j set j.minSalary = :minSalary where j.updateId = :updateId")
    void updateMinSalary(@Param(value = "minSalary") Double minSalary, @Param(value = "updateId") Integer updateId);

    @Modifying
    @Query("update JobAdvertisementUpdate j set j.maxSalary = :maxSalary where j.updateId = :updateId")
    void updateMaxSalary(@Param(value = "maxSalary") Double maxSalary, @Param(value = "updateId") Integer updateId);

    @Modifying
    @Query("update JobAdvertisementUpdate j set j.workModel = :workModel where j.updateId = :updateId")
    void updateWorkModel(@Param(value = "workModel") String workModel, @Param(value = "updateId") Integer updateId);

    @Modifying
    @Query("update JobAdvertisementUpdate j set j.workTime = :workTime where j.updateId = :updateId")
    void updateWorkTime(@Param(value = "workTime") String workTime, @Param(value = "updateId") Integer updateId);

    @Modifying
    @Query("update JobAdvertisementUpdate j set j.deadline = :deadLine where j.updateId = :updateId")
    void updateDeadLine(@Param(value = "deadLine") LocalDate deadLine, @Param(value = "updateId") Integer updateId);

}
