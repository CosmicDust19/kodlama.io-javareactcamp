package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.CandidateSchoolService;
import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.utilities.MSGs;
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
    private final CheckService check;

    @Override
    public DataResult<List<CandidateSchool>> getAll() {
        return new SuccessDataResult<>(candidateSchoolDao.findAll());
    }

    @Override
    public DataResult<List<CandidateSchool>> getByGradYear(Short sortDirection) {
        Sort sort = Utils.getSortByDirection(sortDirection, "graduationYear");
        return new SuccessDataResult<>(MSGs.SORT_DIRECTION.getCustom("%s (graduationYear)"), candidateSchoolDao.findAll(sort));
    }

    @Override
    public Result add(CandidateSchoolAddDto candidateSchoolAddDto) {
        Map<String, String> errors = new HashMap<>();
        if (!candidateDao.existsById(candidateSchoolAddDto.getCandidateId()))
            errors.put("candidateId", MSGs.NOT_EXIST.get());
        if (check.notExistsById(schoolDao, candidateSchoolAddDto.getSchoolId()))
            errors.put("school.id", MSGs.NOT_EXIST.get());
        if (check.notExistsById(departmentDao, candidateSchoolAddDto.getDepartmentId()))
            errors.put("department.id", MSGs.NOT_EXIST.get());
        if (check.startEndConflict(candidateSchoolAddDto.getStartYear(), candidateSchoolAddDto.getGraduationYear()))
            errors.put("start year - graduation year", MSGs.START_END_CONFLICT.get());
        if (!errors.isEmpty()) return new ErrorDataResult<>(MSGs.FAILED.get(), errors);

        CandidateSchool candidateSchool = modelMapper.map(candidateSchoolAddDto, CandidateSchool.class);

        CandidateSchool savedCandidateSchool = candidateSchoolDao.save(candidateSchool);
        return new SuccessDataResult<>(MSGs.SAVED.getCustom("%s (data: new id)"), savedCandidateSchool.getId());
    }

    @Override
    public DataResult<Boolean> deleteById(int candSchId) {
        candidateSchoolDao.deleteById(candSchId);
        return new SuccessDataResult<>(MSGs.DELETED.get(), true);
    }

    @Override
    public Result updateSchool(int schoolId, int candSchId) {
        if (check.notExistsById(candidateSchoolDao, candSchId)) return new ErrorResult(MSGs.NOT_EXIST.get("candSchId"));
        if (check.notExistsById(schoolDao, schoolId)) return new ErrorResult(MSGs.NOT_EXIST.get("schoolId"));

        candidateSchoolDao.updateSchool(new School(schoolId), candSchId);
        return new SuccessResult(MSGs.UPDATED.get());
    }

    @Override
    public Result updateDepartment(short departmentId, int candSchId) {
        if (check.notExistsById(candidateSchoolDao, candSchId)) return new ErrorResult(MSGs.NOT_EXIST.get("candSchId"));
        if (check.notExistsById(departmentDao, departmentId)) return new ErrorResult(MSGs.NOT_EXIST.get("department"));

        candidateSchoolDao.updateDepartment(new Department(departmentId), candSchId);
        return new SuccessResult(MSGs.UPDATED.get());
    }

    @Override
    public Result updateStartYear(short startYear, int candSchId) {
        if (check.notExistsById(candidateSchoolDao, candSchId)) return new ErrorResult(MSGs.NOT_EXIST.get("candSchId"));

        CandidateSchool candidateSchool = candidateSchoolDao.getById(candSchId);
        if (candidateSchool.getStartYear() == startYear)
            return new ErrorResult(MSGs.THE_SAME.get("startYear"));
        if (check.startEndConflict(candidateSchool.getGraduationYear(), startYear))
            return new ErrorResult(MSGs.START_END_CONFLICT.get());

        candidateSchoolDao.updateStartYear(startYear, candSchId);
        return new SuccessResult(MSGs.UPDATED.get());
    }

    @Override
    public Result updateGradYear(Short graduationYear, int candSchId) {
        if (check.notExistsById(candidateSchoolDao, candSchId)) return new ErrorResult(MSGs.NOT_EXIST.get("candSchId"));

        CandidateSchool candidateSchool = candidateSchoolDao.getById(candSchId);
        if (check.equals(candidateSchool.getGraduationYear(), graduationYear))
            return new ErrorResult(MSGs.THE_SAME.get("graduationYear"));
        if (check.startEndConflict(candidateSchool.getStartYear(), graduationYear))
            return new ErrorResult(MSGs.START_END_CONFLICT.get());

        candidateSchoolDao.updateGraduationYear(graduationYear, candSchId);
        return new SuccessResult(MSGs.UPDATED.get());
    }

}
