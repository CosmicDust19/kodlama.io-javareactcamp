package com.finalproject.hrmsbackend.dataAccess.abstracts;

import com.finalproject.hrmsbackend.entities.concretes.CandidateCv;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Transactional
@Repository
public interface CandidateCvDao extends JpaRepository<CandidateCv, Integer> {
    boolean existsByTitle(String title);

    @Modifying
    @Query("update CandidateCv cv set cv.title = :title where cv.id = :id")
    void updateTitle(@Param(value = "title") String title, @Param(value = "id") Integer id);

    @Modifying
    @Query("update CandidateCv cv set cv.coverLetter = :coverLetter where cv.id = :id")
    void updateCoverLetter(@Param(value = "coverLetter") String coverLetter, @Param(value = "id") Integer id);

}
