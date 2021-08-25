package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.CandidateSchoolService;
import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.utilities.Msg;
import com.finalproject.hrmsbackend.core.utilities.Utils;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.CandidateSchoolDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.DepartmentDao;
import com.finalproject.hrmsbackend.dataAccess.abstracts.SchoolDao;
import com.finalproject.hrmsbackend.entities.concretes.CandidateSchool;
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
        return new SuccessDataResult<>(Msg.SORT_DIRECTION.getCustom("%s (graduationYear)"), candidateSchoolDao.findAll(sort));
    }

    @Override
    public Result add(CandidateSchoolAddDto candidateSchoolAddDto) {
        Map<String, String> errors = new HashMap<>();
        if (!candidateDao.existsById(candidateSchoolAddDto.getCandidateId()))
            errors.put("candidateId", Msg.NOT_EXIST.get());
        if (check.notExistsById(schoolDao, candidateSchoolAddDto.getSchoolId()))
            errors.put("school.id", Msg.NOT_EXIST.get());
        if (check.notExistsById(departmentDao, candidateSchoolAddDto.getDepartmentId()))
            errors.put("department.id", Msg.NOT_EXIST.get());
        if (check.startEndConflict(candidateSchoolAddDto.getStartYear(), candidateSchoolAddDto.getGraduationYear()))
            errors.put("start year - graduation year", Msg.START_END_YEAR_CONFLICT.get());
        if (!errors.isEmpty()) return new ErrorDataResult<>(Msg.FAILED.get(), errors);

        CandidateSchool candidateSchool = modelMapper.map(candidateSchoolAddDto, CandidateSchool.class);

        CandidateSchool savedCandidateSchool = candidateSchoolDao.save(candidateSchool);
        return new SuccessDataResult<>(Msg.SAVED.get(), savedCandidateSchool);
    }

    @Override
    public Result deleteById(int candSchId) {
        candidateSchoolDao.deleteById(candSchId);
        return new SuccessResult(Msg.DELETED.get());
    }

    @Override
    public Result updateSchool(int schoolId, int candSchId) {
        if (check.notExistsById(candidateSchoolDao, candSchId)) return new ErrorResult(Msg.NOT_EXIST.get("candSchId"));
        if (check.notExistsById(schoolDao, schoolId)) return new ErrorResult(Msg.NOT_EXIST.get("schoolId"));

        CandidateSchool candSch = candidateSchoolDao.getById(candSchId);
        candSch.setSchool(schoolDao.getById(schoolId));
        CandidateSchool savedCandSch = candidateSchoolDao.save(candSch);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedCandSch);
    }

    @Override
    public Result updateDepartment(short departmentId, int candSchId) {
        if (check.notExistsById(candidateSchoolDao, candSchId)) return new ErrorResult(Msg.NOT_EXIST.get("candSchId"));
        if (check.notExistsById(departmentDao, departmentId)) return new ErrorResult(Msg.NOT_EXIST.get("department"));

        CandidateSchool candSch = candidateSchoolDao.getById(candSchId);
        candSch.setDepartment(departmentDao.getById(departmentId));
        CandidateSchool savedCandSch = candidateSchoolDao.save(candSch);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedCandSch);
    }

    @Override
    public Result updateStartYear(short startYear, int candSchId) {
        if (check.notExistsById(candidateSchoolDao, candSchId)) return new ErrorResult(Msg.NOT_EXIST.get("candSchId"));

        CandidateSchool candidateSchool = candidateSchoolDao.getById(candSchId);
        if (candidateSchool.getStartYear() == startYear)
            return new ErrorResult(Msg.THE_SAME.get("Start year"));
        if (check.startEndConflict(candidateSchool.getGraduationYear(), startYear))
            return new ErrorResult(Msg.START_END_YEAR_CONFLICT.get());

        CandidateSchool candSch = candidateSchoolDao.getById(candSchId);
        candSch.setStartYear(startYear);
        CandidateSchool savedCandSch = candidateSchoolDao.save(candSch);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedCandSch);
    }

    @Override
    public Result updateGradYear(Short graduationYear, int candSchId) {
        if (check.notExistsById(candidateSchoolDao, candSchId)) return new ErrorResult(Msg.NOT_EXIST.get("candSchId"));

        CandidateSchool candidateSchool = candidateSchoolDao.getById(candSchId);
        if (check.equals(candidateSchool.getGraduationYear(), graduationYear))
            return new ErrorResult(Msg.THE_SAME.get("Graduation year"));
        if (check.startEndConflict(candidateSchool.getStartYear(), graduationYear))
            return new ErrorResult(Msg.START_END_YEAR_CONFLICT.get());

        CandidateSchool candSch = candidateSchoolDao.getById(candSchId);
        candSch.setStartYear(graduationYear);
        CandidateSchool savedCandSch = candidateSchoolDao.save(candSch);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedCandSch);
    }

}
