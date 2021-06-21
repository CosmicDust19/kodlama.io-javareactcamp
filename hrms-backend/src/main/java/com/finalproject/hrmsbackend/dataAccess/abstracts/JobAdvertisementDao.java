package com.finalproject.hrmsbackend.dataAccess.abstracts;

import com.finalproject.hrmsbackend.entities.concretes.JobAdvertisement;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Transactional
@Repository
public interface JobAdvertisementDao extends JpaRepository<JobAdvertisement, Integer> {

    List<JobAdvertisement> findAllByActivationStatusTrue();

    List<JobAdvertisement> findAllByActivationStatusTrue(Sort sort);

    List<JobAdvertisement> getByActivationStatusTrueAndEmployer_Id(int employerId);

    @Modifying
    @Query("update JobAdvertisement j set j.activationStatus = :activationStatus where j.id = :id")
    void updateActivationStatus(@Param(value = "activationStatus") boolean activationStatus, @Param(value = "id") int id);

}
