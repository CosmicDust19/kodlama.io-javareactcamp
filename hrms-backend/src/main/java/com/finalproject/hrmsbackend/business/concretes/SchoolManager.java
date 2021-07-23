package com.finalproject.hrmsbackend.business.concretes;

import com.finalproject.hrmsbackend.business.abstracts.SchoolService;
import com.finalproject.hrmsbackend.core.business.abstracts.CheckService;
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
    public Result add(String schoolName) {
        schoolDao.save(new School(schoolName));
        return new SuccessResult(MSGs.SAVED.get());
    }
}
