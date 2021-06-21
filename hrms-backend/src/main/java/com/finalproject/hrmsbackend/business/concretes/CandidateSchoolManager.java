package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.CandidateSchoolService;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateSchoolDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.DepartmentDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.SchoolDao;
import com.finalproject.hrmsbackend.entities.concretes.CandidateSchool;
import com.finalproject.hrmsbackend.entities.concretes.Department;
import com.finalproject.hrmsbackend.entities.concretes.School;
import com.finalproject.hrmsbackend.entities.concretes.dtos.CandidateSchoolAddDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CandidateSchoolManager implements CandidateSchoolService {

    private final CandidateDao candidateDao;
    private final CandidateSchoolDao candidateSchoolDao;
    private final SchoolDao schoolDao;
    private final DepartmentDao departmentDao;
    private final ModelMapper modelMapper;

    @Override
    public DataResult<List<CandidateSchool>> getAll() {
        return new SuccessDataResult<>("Success", candidateSchoolDao.findAll());
    }

    @Override
    public DataResult<List<CandidateSchool>> getAllSortedDesc() {
        Sort sort = Sort.by(Sort.Direction.DESC, "graduationYear");
        return new SuccessDataResult<>("Success", candidateSchoolDao.findAll(sort));
    }

    @Override
    public Result add(CandidateSchoolAddDto candidateSchoolAddDto) {
        CandidateSchool candidateSchool = modelMapper.map(candidateSchoolAddDto, CandidateSchool.class);

        Map<String, String> errors = new HashMap<>();

        if (!candidateDao.existsById(candidateSchool.getCandidate().getId()))
            errors.put("candidateId", "does not exist");
        if (candidateSchool.getGraduationYear() != null && candidateSchool.getSchoolStartYear() > candidateSchool.getGraduationYear())
            errors.put("start year - graduation year", "the graduation year cannot be a date before the start year");

        School school = candidateSchool.getSchool();
        school.setName(Utils.formName(school.getName()));
        if (!Utils.tryToSaveIfNotExists(school, schoolDao))
            school.setId(schoolDao.getByName(school.getName()).getId());

        Department department = candidateSchool.getDepartment();
        department.setName(Utils.formName(department.getName()));
        if (!Utils.tryToSaveIfNotExists(department, departmentDao))
            department.setId(departmentDao.getByName(department.getName()).getId());

        if (!errors.isEmpty()) return new ErrorDataResult<>("Error", errors);

        candidateSchoolDao.save(candidateSchool);
        return new SuccessResult("Success");
    }
}
