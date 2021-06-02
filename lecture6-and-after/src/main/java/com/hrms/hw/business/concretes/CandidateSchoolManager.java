package com.hrms.hw.business.concretes;

import com.hrms.hw.business.abstracts.CandidateSchoolService;
import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.core.utilities.results.SuccessDataResult;
import com.hrms.hw.core.utilities.results.SuccessResult;
import com.hrms.hw.dataAccess.abstracts.CandidateSchoolDao;
import com.hrms.hw.entities.concretes.CandidateSchool;
import com.hrms.hw.entities.concretes.dtos.CandidateSchoolAddDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateSchoolManager implements CandidateSchoolService {

    private final CandidateSchoolDao candidateSchoolDao;
    private final ModelMapper modelMapper;

    @Override
    public DataResult<List<CandidateSchool>> getAll() {
        return new SuccessDataResult<>("Success", candidateSchoolDao.findAll());
    }

    @Override
    public DataResult<List<CandidateSchool>> getAllSortedDesc() {
        Sort sort = Sort.by(Sort.Direction.DESC,"graduationYear");
        return new SuccessDataResult<>("Success", candidateSchoolDao.findAll(sort));
    }

    @Override
    public Result add(CandidateSchoolAddDto candidateSchoolAddDto) {
        CandidateSchool candidateSchool = modelMapper.map(candidateSchoolAddDto, CandidateSchool.class);
        candidateSchool.setCandidateIdSchoolIdDepartmentId(candidateSchoolAddDto.getCandidateId(),
                candidateSchoolAddDto.getSchoolId(), candidateSchoolAddDto.getDepartmentId());
        candidateSchoolDao.save(candidateSchool);
        return new SuccessResult("Success");
    }
}
