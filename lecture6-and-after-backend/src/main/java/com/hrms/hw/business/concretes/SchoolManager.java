package com.hrms.hw.business.concretes;

import com.hrms.hw.business.abstracts.SchoolService;
import com.hrms.hw.core.utilities.results.DataResult;
import com.hrms.hw.core.utilities.results.Result;
import com.hrms.hw.core.utilities.results.SuccessDataResult;
import com.hrms.hw.core.utilities.results.SuccessResult;
import com.hrms.hw.dataAccess.abstracts.SchoolDao;
import com.hrms.hw.entities.concretes.School;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SchoolManager implements SchoolService {

    private final SchoolDao schoolDao;

    @Override
    public DataResult<List<School>> getAll(){
        return new SuccessDataResult<>("Success", schoolDao.findAll());
    }

    @Override
    public Result add(School school){
        schoolDao.save(school);
        return new SuccessResult("Success");
    }
}
