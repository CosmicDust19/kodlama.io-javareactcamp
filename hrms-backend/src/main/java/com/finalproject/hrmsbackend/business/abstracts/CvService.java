package com.finalproject.hrmsbackend.business.abstracts;

import com.finalproject.hrmsbackend.core.utilities.results.DataResult;
import com.finalproject.hrmsbackend.core.utilities.results.Result;
import com.finalproject.hrmsbackend.entities.concretes.Cv;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CvAddDto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CvService {

    boolean existsCandidatePropInCv(Class<?> propType, int propId, int cvId);

    DataResult<List<Cv>> getAll();

    DataResult<Cv> getById(int id);

    Result add(CvAddDto cvAddDto);

    Result deleteById(int id);

    Result updateTitle(String title, int id);

    Result updateCoverLetter(String coverLetter, int id);

    Result addPropsToCv(int cvId, List<Integer> cvPropIds, JpaRepository<?, Integer> cvPropDao, String checkType, Class<?> propType);

    Result deletePropsFromCv(int cvId, List<Integer> cvPropIds, String checkType, Class<?> propType);

}
