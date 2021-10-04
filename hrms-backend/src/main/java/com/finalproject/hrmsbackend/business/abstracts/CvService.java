package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.Cv;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CvAddDto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface CvService {

    boolean existsCandidatePropInCv(Class<?> propType, int propId, int cvId);

    DataResult<List<Cv>> getAll();

    DataResult<Cv> getById(int cvId);

    Result add(CvAddDto cvAddDto);

    Result deleteById(int cvId);

    Result updateTitle(String title, int cvId);

    Result updateCoverLetter(String coverLetter, int cvId);

    Result updateImg(Integer imgId, int cvId);

    Result addCandidatePropsToCv(int cvId, Set<Integer> cvPropIds, JpaRepository<?, Integer> cvPropDao, String checkType, Class<?> propType);

    Result removePropsFromCv(int cvId, Set<Integer> cvPropIds, String checkType, Class<?> propType);

}
