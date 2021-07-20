package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.SchoolService;
import com.finalproject.hrmsbackend.core.business.CheckService;
import com.finalproject.hrmsbackend.core.utilities.MSGs;
import com.finalproject.hrmsbackend.core.utilities.results.*;
import com.finalproject.hrmsbackend.dataAccess.abstracts.SchoolDao;
import com.finalproject.hrmsbackend.entities.concretes.School;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SchoolManager implements SchoolService {

    private final SchoolDao schoolDao;
    private final CheckService check;

    @Override
    public DataResult<List<School>> getAll() {
        return new SuccessDataResult<>(schoolDao.findAll());
    }

    @Override
    public Result add(School school) {
        if (school.getName() != null) school.setName(school.getName().trim());
        if (check.invalidLength(school.getName(), 0, 100)) return new ErrorResult(MSGs.INVALID.get("schoolName"));
        schoolDao.save(school);
        return new SuccessResult(MSGs.SAVED.get());
    }
}
