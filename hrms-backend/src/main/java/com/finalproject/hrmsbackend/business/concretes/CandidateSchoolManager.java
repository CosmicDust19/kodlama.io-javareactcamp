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
        if (candidateSchool.getSchool() == null) errors.put("school", "null");
        if (candidateSchool.getDepartment() == null) errors.put("department", "null");
        if (!errors.isEmpty()) return new ErrorDataResult<>("Error", errors);

        School school = candidateSchool.getSchool();
        school.setName(Utils.formName(school.getName()));
        if (school.getId() <= 0  || !schoolDao.existsById(school.getId()))
            if(school.getName() == null || school.getName().length() == 0)
                return new ErrorResult("school id or school name should be given");
        Department department = candidateSchool.getDepartment();
        department.setName(Utils.formName(department.getName()));
        if (department.getId() <= 0  || !departmentDao.existsById(department.getId()))
            if(department.getName() == null || department.getName().length() == 0)
                return new ErrorResult("department id or department name should be given");

        if (!Utils.tryToSaveIfNotExists(school, schoolDao))
            school.setId(schoolDao.getByName(school.getName()).getId());
        if (!Utils.tryToSaveIfNotExists(department, departmentDao))
            department.setId(departmentDao.getByName(department.getName()).getId());

        if (candidateSchoolDao.existsByCandidateAndSchoolAndDepartment(candidateSchool.getCandidate(), school, department))
            return new ErrorResult("this candidate already have this school and this department together");

        CandidateSchool savedCandidateSchool = candidateSchoolDao.save(candidateSchool);
        return new SuccessResult(Integer.toString(savedCandidateSchool.getId()));
    }

    @Override
    public DataResult<Boolean> deleteById(int id) {
        if (id <= 0 || !candidateSchoolDao.existsById(id))
            return new ErrorDataResult<>("id does not exist", false);
        candidateSchoolDao.deleteById(id);
        return new SuccessDataResult<>("Success", true);
    }

    @Override
    public Result updateSchool(int schoolId, int id){
        School school = new School();
        school.setId(schoolId);
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !candidateSchoolDao.existsById(id))
            errors.put("candidateId", "does not exist");
        if (school.getId() <= 0 || !schoolDao.existsById(school.getId()))
            errors.put("school", "does not exist");
        if (!errors.isEmpty()) return new ErrorDataResult<>("Error", errors);
        CandidateSchool candidateSchool = candidateSchoolDao.getById(id);
        if (candidateSchool.getSchool().getId() == schoolId)
            return new ErrorResult("school is the same");
        if (candidateSchoolDao.existsByCandidateAndSchoolAndDepartment(candidateSchool.getCandidate(), school, candidateSchool.getDepartment()))
            return new ErrorResult("the candidateSchool that you want to create is already exists");
        candidateSchoolDao.updateSchool(school, id);
        return new SuccessResult("Success");
    }

    @Override
    public Result updateDepartment(short departmentId, int id){
        Department department = new Department();
        department.setId(departmentId);
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !candidateSchoolDao.existsById(id))
            errors.put("candidateId", "does not exist");
        if (department.getId() <= 0 || !departmentDao.existsById(department.getId()))
            errors.put("department", "does not exist");
        if (!errors.isEmpty()) return new ErrorDataResult<>("Error", errors);
        CandidateSchool candidateSchool = candidateSchoolDao.getById(id);
        if (candidateSchool.getDepartment().getId() == departmentId)
            return new ErrorResult("department is the same");
        if (candidateSchoolDao.existsByCandidateAndSchoolAndDepartment(candidateSchool.getCandidate(), candidateSchool.getSchool(), department))
            return new ErrorResult("the candidateSchool that you want to create is already exists");
        candidateSchoolDao.updateDepartment(department, id);
        return new SuccessResult("Success");
    }

    @Override
    public Result updateStartYear(short schoolStartYear, int id){
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !candidateSchoolDao.existsById(id))
            errors.put("candidateId", "does not exist");
        if (schoolStartYear < 1900 || schoolStartYear > 2030)
            errors.put("startYear", "invalid startYear");
        if (!errors.isEmpty()) return new ErrorDataResult<>("Error", errors);
        CandidateSchool candidateSchool = candidateSchoolDao.getById(id);
        if (candidateSchool.getSchoolStartYear() == schoolStartYear)
            return new ErrorResult("schoolStartYear is the same");
        if (candidateSchool.getGraduationYear() != null && candidateSchool.getGraduationYear() < schoolStartYear)
            return new ErrorResult("schoolStartYear cannot be grater than graduationYear");
        candidateSchoolDao.updateStartYear(schoolStartYear, id);
        return new SuccessResult("Success");
    }

    @Override
    public Result updateGraduationYear(Short graduationYear, int id){
        Map<String, String> errors = new HashMap<>();
        if (id <= 0 || !candidateSchoolDao.existsById(id))
            errors.put("candidateId", "does not exist");
        if (graduationYear != null && (graduationYear < 1900 || graduationYear > 2030))
            errors.put("graduationYear", "invalid graduationYear");
        if (!errors.isEmpty()) return new ErrorDataResult<>("Error", errors);
        CandidateSchool candidateSchool = candidateSchoolDao.getById(id);
        if (candidateSchool.getGraduationYear() != null && candidateSchool.getGraduationYear().equals(graduationYear) ||
                (candidateSchool.getGraduationYear() == null && graduationYear == null))
            return new ErrorResult("graduationYear is the same");
        if (graduationYear != null && candidateSchool.getSchoolStartYear() > graduationYear)
            return new ErrorResult("graduationYear cannot be less than schoolStartYear");
        candidateSchoolDao.updateGraduationYear(graduationYear, id);
        return new SuccessResult("Success");
    }
}
