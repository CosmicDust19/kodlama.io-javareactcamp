package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.CandidateSchoolService;
import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
import com.finalproject.hrmsbackend.core.entities.ApiError;
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
    public Result add(CandidateSchoolAddDto candSchAddDto) {
        Map<String, String> errors = new HashMap<>();
        if (!candidateDao.existsById(candSchAddDto.getCandidateId()))
            errors.put("candidateId", Msg.NOT_EXIST.get("Candidate"));
        if (check.notExistsById(schoolDao, candSchAddDto.getSchoolId()))
            errors.put("schoolId", Msg.NOT_EXIST.get("School"));
        if (check.notExistsById(departmentDao, candSchAddDto.getDepartmentId()))
            errors.put("departmentId", Msg.NOT_EXIST.get("Department"));
        if (check.startEndConflict(candSchAddDto.getStartYear(), candSchAddDto.getGraduationYear()))
            errors.put("startGradYear", Msg.START_END_YEAR_CONFLICT.get());
        if (violatesUk(candSchAddDto))
            errors.put("uk", Msg.UK_CAND_SCH.get());
        if (!errors.isEmpty()) return new ErrorDataResult<>(Msg.FAILED.get(), new ApiError(errors));

        CandidateSchool candidateSchool = modelMapper.map(candSchAddDto, CandidateSchool.class);

        CandidateSchool savedCandSch = candidateSchoolDao.save(candidateSchool);
        savedCandSch.setSchool(schoolDao.getById(savedCandSch.getSchool().getId()));
        savedCandSch.setDepartment(departmentDao.getById(savedCandSch.getDepartment().getId()));
        return new SuccessDataResult<>(Msg.SAVED.get(), savedCandSch);
    }

    @Override
    public Result deleteById(int candSchId) {
        candidateSchoolDao.deleteById(candSchId);
        return new SuccessResult(Msg.DELETED.get());
    }

    @Override
    public Result updateSchool(int schoolId, int candSchId) {
        if (check.notExistsById(candidateSchoolDao, candSchId)) return new ErrorResult(Msg.NOT_EXIST.get("candSchId"));
        if (check.notExistsById(schoolDao, schoolId)) return new ErrorResult(Msg.NOT_EXIST.get("School"));

        CandidateSchool candSch = candidateSchoolDao.getById(candSchId);
        if (candSch.getSchool().getId() == schoolId)
            return new ErrorResult(Msg.IS_THE_SAME.get("School"));

        candSch.setSchool(schoolDao.getById(schoolId));
        CandidateSchool savedCandSch = candidateSchoolDao.save(candSch);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedCandSch);
    }

    @Override
    public Result updateDepartment(short departmentId, int candSchId) {
        if (check.notExistsById(candidateSchoolDao, candSchId)) return new ErrorResult(Msg.NOT_EXIST.get("candSchId"));
        if (check.notExistsById(departmentDao, departmentId)) return new ErrorResult(Msg.NOT_EXIST.get("Department"));

        CandidateSchool candSch = candidateSchoolDao.getById(candSchId);
        if (candSch.getDepartment().getId() == departmentId)
            return new ErrorResult(Msg.IS_THE_SAME.get("Department"));

        candSch.setDepartment(departmentDao.getById(departmentId));
        CandidateSchool savedCandSch = candidateSchoolDao.save(candSch);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedCandSch);
    }

    @Override
    public Result updateStartYear(short startYear, int candSchId) {
        if (check.notExistsById(candidateSchoolDao, candSchId)) return new ErrorResult(Msg.NOT_EXIST.get("candSchId"));

        CandidateSchool candidateSchool = candidateSchoolDao.getById(candSchId);
        if (candidateSchool.getStartYear() == startYear)
            return new ErrorResult(Msg.IS_THE_SAME.get("Start year"));
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
            return new ErrorResult(Msg.IS_THE_SAME.get("Graduation year"));
        if (check.startEndConflict(candidateSchool.getStartYear(), graduationYear))
            return new ErrorResult(Msg.START_END_YEAR_CONFLICT.get());

        CandidateSchool candSch = candidateSchoolDao.getById(candSchId);
        candSch.setStartYear(graduationYear);
        CandidateSchool savedCandSch = candidateSchoolDao.save(candSch);
        return new SuccessDataResult<>(Msg.UPDATED.get(), savedCandSch);
    }

    private boolean violatesUk(CandidateSchoolAddDto candSchAddDto) {
        return candidateSchoolDao.existsBySchool_IdAndDepartment_IdAndCandidate_Id
                (candSchAddDto.getSchoolId(), candSchAddDto.getDepartmentId(), candSchAddDto.getCandidateId());
    }

}
